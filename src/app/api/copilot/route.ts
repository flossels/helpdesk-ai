import { createUIMessageStreamResponse, stepCountIs, streamText, toUIMessageStream, convertToModelMessages } from 'ai'
import { z } from 'zod'
import { db } from '@/shared/lib/db'
import { requireAuthApi } from '@/features/ai/lib/requireAuthApi'
import { budgetExceeded, getRemainingBudget } from '@/features/ai/lib/checkBudget'
import { getModel, resolveModelId } from '@/features/ai/lib/getModel'
import { trackUsage } from '@/features/ai/lib/trackUsage'
import { buildCopilotPrompt } from '@/features/ai/lib/buildCopilotPrompt'
import { getTicketThread } from '@/features/tickets/queries/getTicketThread'
import { trimMessages } from '@/features/copilot/lib/trimMessages'
import { estimateContextTokens } from '@/features/copilot/lib/estimateContextTokens'
import { messageText } from '@/features/copilot/lib/messageText'
import { appendMessage, ensureConversation } from '@/features/copilot/lib/saveConversation'
import { COPILOT_TOOL_APPROVAL, createCopilotTools } from '@/features/copilot/lib/createCopilotTools'
import type { UIMessage } from 'ai'

const bodySchema = z.object({
  conversationId: z.string().min(1),
  ticketId: z.string().min(1).optional(),
  messages: z.array(z.custom<UIMessage>()).min(1)
})

const CONTEXT_LIMIT = 12_000

export async function POST(request: Request) {
  const auth = await requireAuthApi('ai:use')
  if ('response' in auth) return auth.response
  const { user } = auth

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return new Response('Bad request', { status: 400 })
  const { messages, ticketId, conversationId } = parsed.data

  const remainingBudget = await getRemainingBudget(user.organizationId)
  if (remainingBudget <= 0) {
    return new Response('Token budget exceeded', { status: 403 })
  }

  const org = await db.organization.findUnique({
    where: { id: user.organizationId },
    select: { aiModel: true }
  })
  if (!org) return new Response('Not found', { status: 404 })

  const lastUser = messages.at(-1)
  const userText = lastUser ? messageText(lastUser) : ''
  const ownsConversation = await ensureConversation({
    conversationId,
    ticketId,
    agentId: user.id,
    organizationId: user.organizationId,
    title: userText || 'New conversation'
  })
  if (!ownsConversation) return new Response('Forbidden', { status: 403 })
  await appendMessage(conversationId, 'user', userText, estimateContextTokens(userText))

  const modelId = resolveModelId(org.aiModel)
  const ticket = ticketId ? await getTicketThread(ticketId, user.organizationId) : null
  const instructions = buildCopilotPrompt(ticket)
  const trimmed = trimMessages(messages, estimateContextTokens(instructions), CONTEXT_LIMIT)

  const tools = createCopilotTools({
    organizationId: user.organizationId,
    userId: user.id,
    model: modelId,
    scopes: user.scopes
  })

  const result = streamText({
    model: getModel(modelId),
    tools,
    toolApproval: COPILOT_TOOL_APPROVAL,
    stopWhen: [stepCountIs(5), budgetExceeded(remainingBudget)],
    instructions,
    messages: await convertToModelMessages(trimmed),
    maxOutputTokens: 4000,
    onEnd: async ({ text, usage }) => {
      if (text) {
        await appendMessage(conversationId, 'assistant', text, usage.outputTokens ?? 0)
      }
      await trackUsage({
        organizationId: user.organizationId,
        userId: user.id,
        model: modelId,
        feature: 'copilot',
        inputTokens: usage.inputTokens ?? 0,
        outputTokens: usage.outputTokens ?? 0,
        totalTokens: usage.totalTokens ?? 0
      })
    }
  })

  void result.consumeStream()

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => {
        console.error('Copilot stream failed:', error)
        return 'The copilot could not finish that answer.'
      }
    })
  })
}

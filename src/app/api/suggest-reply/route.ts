import { createUIMessageStreamResponse, streamText, toUIMessageStream } from 'ai'
import { z } from 'zod'
import { db } from '@/shared/lib/db'
import { rateLimit } from '@/shared/lib/rateLimit'
import { requireAuthApi } from '@/features/ai/lib/requireAuthApi'
import { isWithinBudget } from '@/features/ai/lib/checkBudget'
import { getModel, resolveModelId } from '@/features/ai/lib/getModel'
import { trackUsage } from '@/features/ai/lib/trackUsage'
import { formatTicketThread } from '@/features/ai/lib/formatTicketThread'
import { buildRagPrompt, SUGGEST_REPLY_PROMPT } from '@/features/ai/lib/prompts'
import { retrieveContext } from '@/features/ai/lib/retrieveContext'
import { getTicketThread } from '@/features/tickets/queries/getTicketThread'

const bodySchema = z.object({ ticketId: z.string().min(1) })

export async function POST(request: Request) {
  const auth = await requireAuthApi('ai:use')
  if ('response' in auth) return auth.response
  const { user } = auth

  const limit = await rateLimit(`suggest-reply:${user.id}`, {
    maxRequests: 10,
    windowMs: 60_000
  })
  if (!limit.allowed) {
    return Response.json({ error: 'Too many requests. Please slow down.' }, { status: 429, headers: { 'Retry-After': '60' } })
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return new Response('Bad request', { status: 400 })

  const ticket = await getTicketThread(parsed.data.ticketId, user.organizationId)
  if (!ticket) return new Response('Not found', { status: 404 })

  if (!(await isWithinBudget(user.organizationId))) {
    return new Response('Token budget exceeded', { status: 403 })
  }

  const org = await db.organization.findUnique({
    where: { id: user.organizationId },
    select: { aiModel: true }
  })
  if (!org) return new Response('Not found', { status: 404 })

  const modelId = resolveModelId(org.aiModel)
  const thread = formatTicketThread(ticket)
  const context = await retrieveContext(`${ticket.subject} ${thread}`, user.organizationId)

  const result = streamText({
    model: getModel(modelId),
    instructions: SUGGEST_REPLY_PROMPT + buildRagPrompt(context),
    prompt: thread,
    maxOutputTokens: 3000,
    onEnd: async ({ usage }) => {
      await trackUsage({
        organizationId: user.organizationId,
        userId: user.id,
        model: modelId,
        feature: 'suggest-reply',
        inputTokens: usage.inputTokens ?? 0,
        outputTokens: usage.outputTokens ?? 0,
        totalTokens: usage.totalTokens ?? 0
      })
    }
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => {
        console.error('Suggest reply stream failed:', error)
        return 'The suggestion could not be completed.'
      }
    })
  })
}

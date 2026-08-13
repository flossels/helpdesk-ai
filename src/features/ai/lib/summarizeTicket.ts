import 'server-only'
import { streamText } from 'ai'
import { getModel, resolveModelId } from '@/features/ai/lib/getModel'
import { trackUsage } from '@/features/ai/lib/trackUsage'
import { SUMMARIZE_TICKET_PROMPT } from '@/features/ai/lib/prompts'

type StreamSummaryInput = {
  model: string
  organizationId: string
  userId: string
  thread: string
}

export function streamTicketSummary(input: StreamSummaryInput) {
  const modelId = resolveModelId(input.model)

  return streamText({
    model: getModel(modelId),
    instructions: SUMMARIZE_TICKET_PROMPT,
    prompt: input.thread,
    maxOutputTokens: 500,
    onEnd: async ({ usage }) => {
      await trackUsage({
        organizationId: input.organizationId,
        userId: input.userId,
        model: modelId,
        feature: 'summarize',
        inputTokens: usage.inputTokens ?? 0,
        outputTokens: usage.outputTokens ?? 0,
        totalTokens: usage.totalTokens ?? 0
      }).catch((error) => console.error('Usage tracking failed:', error))
    }
  })
}

'use server'

import { generateText, Output } from 'ai'
import { db } from '@/shared/lib/db'
import { getModel, resolveModelId } from '@/features/ai/lib/getModel'
import { trackUsage } from '@/features/ai/lib/trackUsage'
import { CATEGORIZE_TICKET_PROMPT } from '@/features/ai/lib/prompts'
import { categorizationSchema } from '@/features/ai/schemas/categorization'

const HIGH_CONFIDENCE = 0.8

export async function categorizeTicket(ticketId: string, organizationId: string) {
  const org = await db.organization.findUnique({
    where: { id: organizationId },
    select: { aiModel: true, autoCategorizationEnabled: true, autoSentimentEnabled: true }
  })
  if (!org?.autoCategorizationEnabled) return

  const ticket = await db.ticket.findFirst({
    where: { id: ticketId, organizationId },
    select: { subject: true, description: true, customerId: true }
  })
  if (!ticket) return

  const categories = await db.category.findMany({
    where: { organizationId },
    select: { id: true, name: true, description: true }
  })
  const categoryList = categories.map((c) => `- ${c.name}: ${c.description ?? ''}`).join('\n')

  const modelId = resolveModelId(org.aiModel)

  try {
    const result = await generateText({
      model: getModel(modelId),
      output: Output.object({ schema: categorizationSchema }),
      instructions: CATEGORIZE_TICKET_PROMPT.replace('{categories}', categoryList),
      prompt: `${ticket.subject}\n\n${ticket.description}`,
      maxOutputTokens: 2000
    })

    const { category, priority, sentiment, confidence } = result.output
    const matched = categories.find((c) => c.name === category)
    const applied = matched != null && confidence >= HIGH_CONFIDENCE

    if (applied && matched) {
      await db.ticket.update({
        where: { id: ticketId },
        data: { categoryId: matched.id, priority, ...(org.autoSentimentEnabled ? { sentiment } : {}) }
      })
    }

    await db.activityLog.create({
      data: {
        organizationId,
        userId: ticket.customerId,
        action: applied ? 'ai.categorized' : 'ai.categorization_suggested',
        entityType: 'ticket',
        entityId: ticketId,
        metadata: { category, priority, sentiment, confidence }
      }
    })

    const { inputTokens, outputTokens, totalTokens } = result.usage
    await trackUsage({
      organizationId,
      model: modelId,
      feature: 'categorize',
      inputTokens: inputTokens ?? 0,
      outputTokens: outputTokens ?? 0,
      totalTokens: totalTokens ?? 0
    })
  } catch (error) {
    console.error('Categorization failed:', error)
  }
}

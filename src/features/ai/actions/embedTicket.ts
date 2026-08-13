'use server'

import { unstable_rethrow } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'
import { embedMany } from 'ai'
import { db } from '@/shared/lib/db'
import { getEmbeddingModel } from '@/features/ai/lib/getEmbeddingModel'
import { chunkText } from '@/features/ai/lib/chunkText'
import { trackUsage } from '@/features/ai/lib/trackUsage'
import { EMBEDDING_CONFIG } from '@/features/ai/lib/aiConfig'

export async function embedTicket(ticketId: string, organizationId: string) {
  const ticket = await db.ticket.findFirst({
    where: { id: ticketId, organizationId },
    select: { subject: true, description: true, customerId: true }
  })
  if (!ticket) return

  const reply = await db.ticketReply.findFirst({
    where: { ticketId, NOT: { authorId: ticket.customerId } },
    orderBy: { createdAt: 'desc' },
    select: { contentText: true }
  })

  const solution = reply?.contentText
  if (!solution) return

  const chunks = chunkText(`Problem: ${ticket.subject}\n\n${ticket.description}\n\nSolution: ${solution}`)

  try {
    const { embeddings, usage } = await embedMany({
      model: getEmbeddingModel(),
      values: chunks
    })

    await db.$transaction([
      db.ticketEmbedding.deleteMany({ where: { ticketId } }),
      ...chunks.map(
        (chunk, i) =>
          db.$executeRaw`
          INSERT INTO "TicketEmbedding"
            (id, "ticketId", "chunkIndex", "chunkText", embedding)
          VALUES (
            ${crypto.randomUUID()}, ${ticketId}, ${i}, ${chunk},
            ${JSON.stringify(embeddings[i])}::vector
          )
        `
      )
    ])

    await trackUsage({
      organizationId,
      model: EMBEDDING_CONFIG.model,
      feature: 'embed-ticket',
      inputTokens: usage.tokens,
      outputTokens: 0,
      totalTokens: usage.tokens
    })
  } catch (error) {
    unstable_rethrow(error)
    Sentry.captureException(error)
    console.error('Embedding ticket failed:', error)
  }
}

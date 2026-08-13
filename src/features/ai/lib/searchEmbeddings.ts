import 'server-only'
import { embed } from 'ai'
import { db } from '@/shared/lib/db'
import { getEmbeddingModel } from '@/features/ai/lib/getEmbeddingModel'
import { EMBEDDING_CONFIG } from '@/features/ai/lib/aiConfig'

export type ArticleChunk = {
  chunkText: string
  articleId: string
  articleTitle: string
  articleSlug: string
  similarity: number
}

export type TicketChunk = {
  chunkText: string
  ticketId: string
  trackingId: string
  ticketSubject: string
  similarity: number
}

export async function embedQuery(query: string): Promise<string> {
  const { embedding } = await embed({ model: getEmbeddingModel(), value: query })
  return JSON.stringify(embedding)
}

export async function searchArticleEmbeddings(
  vec: string,
  organizationId: string,
  topK = EMBEDDING_CONFIG.topK
): Promise<ArticleChunk[]> {
  return db.$queryRaw<ArticleChunk[]>`
    SELECT
      ae."chunkText", a.id AS "articleId",
      a.title AS "articleTitle", a.slug AS "articleSlug",
      1 - (ae.embedding <=> ${vec}::vector) AS similarity
    FROM "ArticleEmbedding" ae
    JOIN "Article" a ON a.id = ae."articleId"
    WHERE a."organizationId" = ${organizationId}
      AND a.status = 'PUBLISHED'
      AND 1 - (ae.embedding <=> ${vec}::vector)
          > ${EMBEDDING_CONFIG.similarityThreshold}
    ORDER BY ae.embedding <=> ${vec}::vector
    LIMIT ${topK}
  `
}

export async function searchTicketEmbeddings(
  vec: string,
  organizationId: string,
  topK = EMBEDDING_CONFIG.topK
): Promise<TicketChunk[]> {
  return db.$queryRaw<TicketChunk[]>`
    SELECT
      te."chunkText", t.id AS "ticketId",
      t."trackingId" AS "trackingId", t.subject AS "ticketSubject",
      1 - (te.embedding <=> ${vec}::vector) AS similarity
    FROM "TicketEmbedding" te
    JOIN "Ticket" t ON t.id = te."ticketId"
    WHERE t."organizationId" = ${organizationId}
      AND t."isDeleted" = false
      AND t.status IN ('RESOLVED', 'CLOSED')
      AND 1 - (te.embedding <=> ${vec}::vector)
          > ${EMBEDDING_CONFIG.similarityThreshold}
    ORDER BY te.embedding <=> ${vec}::vector
    LIMIT ${topK}
  `
}

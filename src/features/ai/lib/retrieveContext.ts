import 'server-only'
import { embedQuery, searchArticleEmbeddings, searchTicketEmbeddings } from '@/features/ai/lib/searchEmbeddings'
import type { ArticleChunk, TicketChunk } from '@/features/ai/lib/searchEmbeddings'

export type RetrievedContext = {
  articleChunks: ArticleChunk[]
  ticketChunks: TicketChunk[]
  hasContext: boolean
}

export async function retrieveContext(query: string, organizationId: string): Promise<RetrievedContext> {
  const vec = await embedQuery(query)
  const [articleChunks, ticketChunks] = await Promise.all([
    searchArticleEmbeddings(vec, organizationId),
    searchTicketEmbeddings(vec, organizationId)
  ])

  return {
    articleChunks,
    ticketChunks,
    hasContext: articleChunks.length > 0 || ticketChunks.length > 0
  }
}

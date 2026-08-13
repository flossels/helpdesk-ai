import 'server-only'

import type { RetrievedContext } from '@/features/ai/lib/retrieveContext'

export function buildRagPrompt(context: RetrievedContext): string {
  let section = ''

  if (context.articleChunks.length > 0) {
    section += '\n\n## Knowledge Base Articles\nCite the article title when you use one.\n\n'
    for (const chunk of context.articleChunks) {
      section += `### ${chunk.articleTitle}\n${chunk.chunkText}\n\n`
    }
  }

  if (context.ticketChunks.length > 0) {
    section += '\n\n## Similar Resolved Tickets\nCite the ticket ID when you use one.\n\n'
    for (const chunk of context.ticketChunks) {
      section += `### ${chunk.trackingId}: ${chunk.ticketSubject}\n${chunk.chunkText}\n\n`
    }
  }

  return section
}

import 'server-only'

import { cache } from 'react'
import StarterKit from '@tiptap/starter-kit'
import { renderToHTMLString } from '@tiptap/static-renderer'
import { db } from '@/shared/lib/db'
import type { JSONContent } from '@tiptap/react'
import type { TicketReplyItem } from '@/features/tickets/types'

const replyExtensions = [StarterKit]

export function renderReplyHtml(content: JSONContent): string {
  try {
    return renderToHTMLString({ content, extensions: replyExtensions })
  } catch (error) {
    console.error('Could not render a reply:', error)
    return ''
  }
}

export const getReplies = cache(async (ticketId: string, organizationId: string): Promise<TicketReplyItem[]> => {
  const replies = await db.ticketReply.findMany({
    where: { ticketId, ticket: { organizationId } },
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: { select: { name: true, role: true } }
    },
    orderBy: { createdAt: 'asc' }
  })

  return replies.map((reply) => ({
    id: reply.id,
    author: reply.author.name,
    bodyHtml: renderReplyHtml(reply.content as JSONContent),
    isAgent: reply.author.role !== 'CUSTOMER',
    createdAt: reply.createdAt
  }))
})

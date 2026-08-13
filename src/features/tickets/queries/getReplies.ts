import 'server-only'

import { cache } from 'react'
import { db } from '@/shared/lib/db'
import type { TicketReplyItem } from '@/features/tickets/types'

export const getReplies = cache(async (ticketId: string): Promise<TicketReplyItem[]> => {
  const replies = await db.ticketReply.findMany({
    where: { ticketId },
    select: {
      id: true,
      contentText: true,
      createdAt: true,
      author: { select: { name: true, role: true } }
    },
    orderBy: { createdAt: 'asc' }
  })

  return replies.map((reply) => ({
    id: reply.id,
    author: reply.author.name,
    body: reply.contentText,
    isAgent: reply.author.role !== 'CUSTOMER',
    createdAt: reply.createdAt
  }))
})

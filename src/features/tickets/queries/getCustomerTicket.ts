import 'server-only'

import { cache } from 'react'
import { db } from '@/shared/lib/db'
import type { TicketReplyItem } from '@/features/tickets/types'
import type { TicketStatus } from '@/shared/types/ticket'

type CustomerTicket = {
  id: string
  trackingId: string
  subject: string
  status: TicketStatus
  messages: TicketReplyItem[]
}

export const getCustomerTicket = cache(async (ticketId: string, customerId: string): Promise<CustomerTicket | null> => {
  const ticket = await db.ticket.findFirst({
    where: { id: ticketId, customerId, isDeleted: false },
    select: {
      id: true,
      trackingId: true,
      subject: true,
      status: true,
      replies: {
        select: {
          id: true,
          contentText: true,
          createdAt: true,
          author: { select: { name: true, role: true } }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  })
  if (!ticket) return null

  return {
    id: ticket.id,
    trackingId: ticket.trackingId,
    subject: ticket.subject,
    status: ticket.status as TicketStatus,
    messages: ticket.replies.map((reply) => ({
      id: reply.id,
      author: reply.author.name,
      body: reply.contentText,
      isAgent: reply.author.role !== 'CUSTOMER',
      createdAt: reply.createdAt
    }))
  }
})

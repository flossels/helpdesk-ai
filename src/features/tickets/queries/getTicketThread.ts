import 'server-only'
import { cache } from 'react'
import { db } from '@/shared/lib/db'

export const getTicketThread = cache(async (ticketId: string, organizationId: string) => {
  return db.ticket.findFirst({
    where: { id: ticketId, organizationId },
    select: {
      subject: true,
      description: true,
      status: true,
      priority: true,
      category: { select: { name: true } },
      customer: { select: { name: true } },
      replies: {
        select: { contentText: true, createdAt: true, author: { select: { name: true } } },
        orderBy: { createdAt: 'asc' }
      },
      notes: {
        select: { contentText: true, createdAt: true, author: { select: { name: true } } },
        orderBy: { createdAt: 'asc' }
      }
    }
  })
})

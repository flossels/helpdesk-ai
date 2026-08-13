import 'server-only'

import { cache } from 'react'
import { db } from '@/shared/lib/db'
import { searchTickets } from '@/features/tickets/queries/searchTickets'
import type { Prisma } from '@/shared/types/database'
import type { TicketFilters, TicketListItem } from '@/features/tickets/types'

export const ticketListSelect = {
  id: true,
  trackingId: true,
  subject: true,
  status: true,
  priority: true,
  slaDeadline: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, color: true } },
  assignee: { select: { id: true, name: true, image: true } },
  customer: { select: { id: true, name: true, email: true } },
  _count: { select: { replies: true } }
} satisfies Prisma.TicketSelect

export const getTickets = cache(async (filters: TicketFilters = {}): Promise<TicketListItem[]> => {
  const { status, search } = filters

  if (search) return searchTickets(search)

  return (await db.ticket.findMany({
    where: { isDeleted: false, ...(status && { status }) },
    select: ticketListSelect,
    orderBy: { updatedAt: 'desc' }
  })) as unknown as TicketListItem[]
})

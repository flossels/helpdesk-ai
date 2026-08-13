import 'server-only'

import { cache } from 'react'
import { db } from '@/shared/lib/db'
import { searchTickets } from '@/features/tickets/queries/searchTickets'
import type { TicketFilters, TicketListItem } from '@/features/tickets/types'
import type { Prisma } from '@/shared/types/database'

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

export const getTickets = cache(async (filters: TicketFilters & { organizationId: string }): Promise<TicketListItem[]> => {
  const { organizationId, status, search } = filters

  // A non-empty search box switches to ranked
  // full-text search; an empty one lists as before.
  if (search) return searchTickets(organizationId, search)

  return (await db.ticket.findMany({
    where: { organizationId, isDeleted: false, ...(status && { status }) },
    select: ticketListSelect,
    orderBy: { updatedAt: 'desc' }
  })) as unknown as TicketListItem[]
})

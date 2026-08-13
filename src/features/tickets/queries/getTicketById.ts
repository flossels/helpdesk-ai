import 'server-only'

import { cache } from 'react'
import { db } from '@/shared/lib/db'
import type { Prisma } from '@/shared/types/database'
import type { TicketPriority, TicketStatus } from '@/shared/types/ticket'

const ticketSelect = {
  id: true,
  trackingId: true,
  subject: true,
  description: true,
  status: true,
  priority: true,
  sentiment: true,
  slaDeadline: true,
  category: { select: { id: true, name: true, color: true } },
  assignee: { select: { id: true, name: true, image: true } },
  customer: { select: { id: true, name: true, email: true, preferredLocale: true } }
} satisfies Prisma.TicketSelect

export type TicketWithRelations = Omit<Prisma.TicketGetPayload<{ select: typeof ticketSelect }>, 'status' | 'priority'> & {
  status: TicketStatus
  priority: TicketPriority
}

export const getTicketById = cache(async (id: string, organizationId: string): Promise<TicketWithRelations | null> => {
  return (await db.ticket.findFirst({
    where: { id, organizationId },
    select: ticketSelect
  })) as unknown as TicketWithRelations | null
})

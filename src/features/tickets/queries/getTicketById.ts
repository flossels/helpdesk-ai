import 'server-only'

import { cache } from 'react'
import { db } from '@/shared/lib/db'
import type { Prisma } from '@/shared/types/database'

const ticketSelect = {
  id: true,
  trackingId: true,
  subject: true,
  description: true,
  status: true,
  priority: true,
  category: { select: { id: true, name: true, color: true } },
  assignee: { select: { id: true, name: true, image: true } },
  customer: { select: { id: true, name: true, email: true } }
} satisfies Prisma.TicketSelect

export const getTicketById = cache(async (id: string) => {
  return db.ticket.findUnique({
    where: { id },
    select: ticketSelect
  })
})

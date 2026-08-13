import 'server-only'

import { cache } from 'react'
import { db } from '@/shared/lib/db'
import { ticketListSelect } from '@/features/tickets/queries/getTickets'
import type { TicketListItem } from '@/features/tickets/types'

export const getCustomerTickets = cache(async (customerId: string): Promise<TicketListItem[]> => {
  return (await db.ticket.findMany({
    where: { customerId, isDeleted: false },
    select: ticketListSelect,
    orderBy: { updatedAt: 'desc' }
  })) as unknown as TicketListItem[]
})

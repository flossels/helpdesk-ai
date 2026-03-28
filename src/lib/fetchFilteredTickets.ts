import type { Ticket, TicketStatus } from '../types'

type FilterValue = TicketStatus | 'ALL'

export async function fetchFilteredTickets(filter: FilterValue, allTickets: Ticket[]): Promise<Ticket[]> {
  await new Promise((resolve) =>
    setTimeout(resolve, 1000),
  )

  if (Math.random() < 0.3) throw new Error('Server error')

  return filter === 'ALL' ? allTickets : allTickets.filter((t) => t.status === filter)
}
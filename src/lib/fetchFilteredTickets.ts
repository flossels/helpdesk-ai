import type { FilterValue, Ticket } from '../types'

export async function fetchFilteredTickets(filter: FilterValue, allTickets: Ticket[]): Promise<Ticket[]> {
  // Simulate server delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000)
  )

  // Simulate occasional failure
  if (Math.random() < 0.3) throw new Error('Server error')

  return filter === 'ALL' ? allTickets : allTickets.filter((t) => t.status === filter)
}
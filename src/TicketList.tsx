import { TicketCard } from './TicketCard.tsx'
import type { Ticket } from './types.ts'

type Props = {
  tickets: Ticket[]
}

export function TicketList({ tickets }: Props) {
  if (tickets.length === 0) return <p>No tickets match the current filter.</p>

  return (
    <div>
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} {...ticket} />
      ))}
    </div>
  )
}
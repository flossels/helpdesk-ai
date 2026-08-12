import Link from 'next/link'
import { RelativeTime } from '@/shared/components/RelativeTime'
import { getTickets } from '@/lib/placeholderData'

export async function TicketList() {
  const tickets = await getTickets()

  return (
    <ul>
      {tickets.map((ticket) => (
        <li key={ticket.id} className="flex gap-2">
          <Link href={`/tickets/${ticket.id}`}>{ticket.subject}</Link>
          <span>{ticket.status}</span>
          <span>{ticket.priority}</span>
          <span>
            Created: <RelativeTime date={ticket.createdAt} />
          </span>
        </li>
      ))}
    </ul>
  )
}

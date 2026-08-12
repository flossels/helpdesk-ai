import Link from 'next/link'
import { RelativeTime } from '@/shared/components/RelativeTime'
import { BulkActionBar } from '@/shared/components/BulkActionBar'
import { getTickets } from '@/lib/placeholderData'
import type { TicketFilters } from '@/lib/placeholderData'

export async function TicketList({ status, search }: TicketFilters) {
  const tickets = await getTickets({ status, search })
  if (!tickets.length) return <p>No tickets found.</p>

  const ticketIds = tickets.map((ticket) => ticket.id)

  return (
    <>
      <BulkActionBar ticketIds={ticketIds} />
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
    </>
  )
}

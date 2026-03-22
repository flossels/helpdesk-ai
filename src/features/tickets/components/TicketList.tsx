import { getTickets, TicketFilters } from '@/lib/placeholderData'
import RelativeTime from '@/shared/components/RelativeTime'
import Link from 'next/link'
import BulkActionBar from '@/features/tickets/components/BulkActionBar'

type Props = TicketFilters

const TicketList = async ({ status, search }: Props) => {
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

export default TicketList

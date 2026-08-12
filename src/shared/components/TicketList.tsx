import Link from 'next/link'
import { RelativeTime } from '@/shared/components/RelativeTime'
import { BulkActionBar } from '@/shared/components/BulkActionBar'
import { cn } from '@/shared/lib/cn'
import { TicketStatusBadge } from '@/shared/components/ui/TicketStatusBadge'
import { TicketPriorityBadge } from '@/shared/components/ui/TicketPriorityBadge'
import { getTickets } from '@/lib/placeholderData'
import type { TicketFilters } from '@/lib/placeholderData'

export async function TicketList({ status, search }: TicketFilters) {
  const tickets = await getTickets({ status, search })
  if (!tickets.length) return <p>No tickets found.</p>

  const ticketIds = tickets.map((ticket) => ticket.id)

  return (
    <>
      <BulkActionBar ticketIds={ticketIds} />
      <ul className={cn('space-y-3')}>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <Link
              href={`/tickets/${ticket.id}`}
              className={cn(
                'flex items-center gap-3 rounded-(--border-radius) bg-white p-4 shadow-sm transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700'
              )}
            >
              <TicketStatusBadge status={ticket.status} />
              <span className={cn('flex-1 truncate text-sm font-medium')}>{ticket.subject}</span>
              <TicketPriorityBadge priority={ticket.priority} />
              <span className={cn('text-xs text-slate-400')}>
                <RelativeTime date={ticket.createdAt} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

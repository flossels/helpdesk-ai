import { forbidden } from 'next/navigation'
import Link from 'next/link'
import { RelativeTime } from '@/shared/components/RelativeTime'
import { Avatar } from '@/shared/components/ui/Avatar'
import { cn } from '@/shared/lib/cn'
import { BulkActionBar } from '@/features/tickets/components/BulkActionBar'
import { getTickets } from '@/features/tickets/queries/getTickets'
import { TicketPriorityBadge } from '@/features/tickets/components/TicketPriorityBadge'
import { TicketStatusBadge } from '@/features/tickets/components/TicketStatusBadge'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'

type Props = {
  searchParams: Promise<{ status?: string | string[]; search?: string | string[] }>
}

export async function TicketList({ searchParams }: Props) {
  const user = await getCurrentUser()
  if (!user?.organizationId) forbidden()

  const { status, search } = await searchParams
  const tickets = await getTickets({
    organizationId: user.organizationId,
    status: status?.toString(),
    search: search?.toString()
  })
  if (!tickets.length) return <p>No tickets found.</p>

  const bulkTickets = tickets.map((ticket) => ({
    id: ticket.id,
    trackingId: ticket.trackingId,
    subject: ticket.subject
  }))

  return (
    <>
      <BulkActionBar tickets={bulkTickets} />
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
              {ticket.assignee ? (
                <Avatar name={ticket.assignee.name ?? 'Unassigned'} image={ticket.assignee.image} size={24} />
              ) : null}
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

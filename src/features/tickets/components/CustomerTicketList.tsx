import Link from 'next/link'
import { RelativeTime } from '@/shared/components/RelativeTime'
import { cn } from '@/shared/lib/cn'
import { TicketStatusBadge } from '@/features/tickets/components/TicketStatusBadge'
import type { TicketListItem } from '@/features/tickets/types'

type Props = {
  tickets: TicketListItem[]
}

export function CustomerTicketList({ tickets }: Props) {
  if (!tickets.length) {
    return <p className={cn('text-sm text-slate-500 dark:text-slate-400')}>You haven&apos;t opened any tickets yet.</p>
  }

  return (
    <ul className={cn('space-y-3')}>
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <Link
            href={`/portal/${ticket.id}`}
            className={cn(
              'flex items-center gap-3 rounded-(--border-radius) bg-white p-4 shadow-sm',
              'transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700'
            )}
          >
            <TicketStatusBadge status={ticket.status} />
            <span className={cn('flex-1 truncate text-sm font-medium text-slate-900 dark:text-slate-100')}>{ticket.subject}</span>
            <span className={cn('shrink-0 text-xs text-slate-400')}>
              <RelativeTime date={ticket.updatedAt} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

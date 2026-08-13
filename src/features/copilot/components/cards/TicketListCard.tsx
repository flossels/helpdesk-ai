'use client'

import { cn } from '@/shared/lib/cn'
import { TicketPriorityBadge } from '@/features/tickets/components/TicketPriorityBadge'
import { TicketStatusBadge } from '@/features/tickets/components/TicketStatusBadge'
import type { TicketSearchResult } from '@/features/copilot/components/cards/types'

type Props = {
  tickets: TicketSearchResult[]
  title?: string
}

export function TicketListCard({ tickets, title = 'Tickets' }: Props) {
  if (tickets.length === 0) {
    return <p className={cn('text-sm text-slate-500')}>No tickets found.</p>
  }

  return (
    <div className={cn('rounded-md border border-slate-200 p-2 dark:border-slate-700')}>
      <h4 className={cn('mb-1 text-xs font-medium text-slate-500')}>
        {title} ({tickets.length})
      </h4>
      <ul className={cn('space-y-1')}>
        {tickets.map((ticket) => (
          <li key={ticket.trackingId} className={cn('flex items-center gap-2 text-sm')}>
            <TicketPriorityBadge priority={ticket.priority} />
            <span className={cn('font-mono text-xs text-slate-500')}>{ticket.trackingId}</span>
            <span className={cn('grow truncate')}>{ticket.subject}</span>
            <TicketStatusBadge status={ticket.status} />
          </li>
        ))}
      </ul>
    </div>
  )
}

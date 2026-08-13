import { cn } from '@/shared/lib/cn'
import type { TicketStatus } from '@/shared/types/ticket'

const statusStyles = {
  OPEN: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  WAITING: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  RESOLVED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  CLOSED: 'bg-slate-50 text-slate-600 ring-slate-500/20'
} satisfies Record<TicketStatus, string>

type Props = {
  status: TicketStatus
}

export function TicketStatusBadge({ status }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
        statusStyles[status]
      )}
    >
      {status.replace('_', ' ')}
    </span>
  )
}

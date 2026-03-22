import { TicketStatus } from '@/lib/placeholderData'
import cn from '@/shared/lib/cn'

const statusStyles: Record<TicketStatus, string> = {
  OPEN: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  WAITING: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  RESOLVED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  CLOSED: 'bg-slate-50 text-slate-600 ring-slate-500/20'
}

type Props = {
  status: TicketStatus
}

const StatusBadge = ({ status }: Props) => {
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

export default StatusBadge

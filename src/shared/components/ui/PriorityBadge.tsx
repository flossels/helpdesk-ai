import { TicketPriority } from '@/lib/placeholderData'
import cn from '@/shared/lib/cn'

const priorityStyles: Record<TicketPriority, string> = {
  LOW: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  MEDIUM: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  HIGH: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  URGENT: 'bg-rose-100 text-rose-800 ring-rose-700/20'
}

type Props = {
  priority: TicketPriority
}

export function PriorityBadge({ priority }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
        priorityStyles[priority]
      )}
    >
      {priority}
    </span>
  )
}

export default PriorityBadge

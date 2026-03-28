import type { TicketStatus } from './types'

const statusLabels = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  WAITING: 'Waiting',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
} satisfies Record<TicketStatus, string>

type Props = {
  status: TicketStatus
}

export function StatusBadge({ status }: Props) {
  return <span>[{statusLabels[status]}]</span>
}
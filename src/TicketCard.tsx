import { StatusBadge } from './StatusBadge.tsx'
import { TicketAge } from './TicketAge.tsx'
import type { Ticket } from './types.ts'

type Props = Pick<Ticket, 'trackingId' | 'subject' | 'status' | 'priority' | 'assigneeName' | 'createdAt'>

export function TicketCard(ticket: Props) {
  return (
    <div>
      <div>
        <strong>{ticket.trackingId}</strong>
        <StatusBadge status={ticket.status} />
      </div>
      <p>{ticket.subject}</p>
      <div>
        <span>Priority: {ticket.priority}</span>
        {ticket.assigneeName && (
          <span> | Assigned to {ticket.assigneeName}</span>
        )}
        <span> | <TicketAge createdAt={ticket.createdAt} /></span>
      </div>
    </div>
  )
}
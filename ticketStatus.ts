type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED'
type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

type Ticket = {
  trackingId: string
  subject: string
  status: TicketStatus
  priority: TicketPriority
  assigneeId: string | null
}

function getStatusMessage(ticket: Ticket): string {
  switch (ticket.status) {
    case 'OPEN':
      return `${ticket.trackingId} is waiting`
    case 'IN_PROGRESS':
      return `${ticket.trackingId} is being handled`
    case 'WAITING':
      return `${ticket.trackingId} is waiting for a response`
    case 'RESOLVED':
      return `${ticket.trackingId} has been resolved`
    case 'CLOSED':
      return `${ticket.trackingId} is closed`
  }
}

function requiresAssignee(ticket: Ticket): boolean {
  return (
    ticket.status === 'IN_PROGRESS' &&
    ticket.assigneeId === null
  )
}

// Test it
const ticket: Ticket = {
  trackingId: 'HD-0042',
  subject: 'Login not working',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  assigneeId: null
}

console.log(getStatusMessage(ticket))
console.log('Needs assignee:', requiresAssignee(ticket))

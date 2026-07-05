type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED'
type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

type Ticket = {
  id: string
  trackingId: string
  subject: string
  status: TicketStatus
  priority: TicketPriority
  assigneeId: string | null
}

const ticket: Ticket = {
  id: 'clx1abc',
  trackingId: 'HD-0042',
  subject: 'Cannot reset password',
  status: 'OPEN',
  priority: 'HIGH',
  assigneeId: null
}

const assigned: Ticket = {
  ...ticket,
  status: 'IN_PROGRESS',
  assigneeId: 'usr-1'
}

console.log('Original status:', ticket.status)
console.log('Updated status:', assigned.status)

const tags = ['auth', 'password']
const withUrgent = [...tags, 'urgent']
console.log('Tags:', withUrgent)

const { id, ...ticketWithoutId } = assigned
console.log('Removed id, keys left:', Object.keys(ticketWithoutId))

function logTicket(label: string, ...fields: string[]) {
  console.log(`[${label}]`, fields.join(', '))
}

logTicket('Ticket', 'HD-0042', 'HIGH', 'OPEN')
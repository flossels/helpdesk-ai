type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED'

type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

type Assignee = {
  id: string
  name: string
  email: string
}

type Category = {
  id: string
  name: string
}

type Ticket = {
  id: string
  trackingId: string
  subject: string
  status: TicketStatus
  priority: TicketPriority
  assignee: Assignee | null
  category: Category
  replyCount: number
  tags: string[]
}

// --- Sample data ---

const ticket: Ticket = {
  id: 'clx1abc',
  trackingId: 'HD-0042',
  subject: 'Cannot reset password',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  assignee: {
    id: 'usr-1',
    name: 'Maria Chen',
    email: 'maria@helpdesk.ai'
  },
  category: { id: 'cat-1', name: 'Authentication' },
  replyCount: 3,
  tags: ['auth', 'password', 'urgent']
}

// --- Object destructuring ---

const { trackingId, subject, status } = ticket
console.log(`${trackingId}: ${subject} [${status}]`)

// --- Renaming ---

const { id: ticketId } = ticket
console.log(`Ticket ID: ${ticketId}`)

// --- Nested destructuring ---

const { category: { name: categoryName } } = ticket
console.log(`Category: ${categoryName}`)

// --- Array destructuring ---

const [firstTag, secondTag] = ticket.tags
console.log(`Tags: ${firstTag}, ${secondTag}`)

// --- Function parameter destructuring ---

function formatTicket({
  trackingId,
  subject,
  priority
}: Pick<Ticket, 'trackingId' | 'subject' | 'priority'>) {
  return `[${priority}] ${trackingId}: ${subject}`
}

console.log(formatTicket(ticket))

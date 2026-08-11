export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED'
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type Ticket = {
  id: string
  trackingId: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  assigneeName?: string
  createdAt: Date
}

export type FilterValue = TicketStatus | 'ALL'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

export const sampleTickets: Ticket[] = [
  {
    id: '1',
    trackingId: 'HD-2847',
    subject: 'Login page not loading',
    description: 'Users report a blank page.',
    status: 'OPEN',
    priority: 'HIGH',
    createdAt: new Date(Date.now() - 12 * SECOND)
  },
  {
    id: '2',
    trackingId: 'HD-2848',
    subject: 'Password reset email delayed',
    description: 'Emails arrive after 10+ minutes.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    assigneeName: 'Daniel',
    createdAt: new Date(Date.now() - 25 * MINUTE)
  },
  {
    id: '3',
    trackingId: 'HD-2849',
    subject: 'Update billing address form',
    description: 'Add country dropdown.',
    status: 'RESOLVED',
    priority: 'LOW',
    assigneeName: 'Sophia',
    createdAt: new Date(Date.now() - 3 * HOUR)
  }
]

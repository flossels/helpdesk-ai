type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED'

type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

type Ticket = {
  id: string
  trackingId: string
  subject: string
  status: TicketStatus
  priority: TicketPriority
  assigneeId: string | null
  replyCount: number
  tags: string[]
}

const tickets: Ticket[] = [
  {
    id: '1',
    trackingId: 'HD-0001',
    subject: 'Cannot reset password',
    status: 'OPEN',
    priority: 'HIGH',
    assigneeId: 'usr-1',
    replyCount: 3,
    tags: [ 'auth', 'password' ]
  },
  {
    id: '2',
    trackingId: 'HD-0002',
    subject: 'Billing discrepancy',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    assigneeId: 'usr-2',
    replyCount: 7,
    tags: [ 'billing', 'urgent' ]
  },
  {
    id: '3',
    trackingId: 'HD-0003',
    subject: 'Feature request: dark mode',
    status: 'OPEN',
    priority: 'LOW',
    assigneeId: null,
    replyCount: 1,
    tags: [ 'feature-request' ]
  },
  {
    id: '4',
    trackingId: 'HD-0004',
    subject: 'Login timeout',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    assigneeId: 'usr-1',
    replyCount: 5,
    tags: [ 'auth', 'performance' ]
  },
  {
    id: '5',
    trackingId: 'HD-0005',
    subject: 'API rate limiting',
    status: 'CLOSED',
    priority: 'HIGH',
    assigneeId: 'usr-3',
    replyCount: 12,
    tags: [ 'api', 'performance' ]
  }
]

// --- map: extract subjects ---
const subjects = tickets.map((t) => t.subject)
console.log('Subjects:', subjects)

// --- filter: open tickets only ---
const open = tickets.filter((t) => t.status === 'OPEN')
console.log('Open:', open.map((t) => t.trackingId))

// --- filter + map chain ---
const urgentSubjects = tickets
.filter((t) => t.priority === 'URGENT')
.map((t) => `${t.trackingId}: ${t.subject}`)
console.log('Urgent:', urgentSubjects)

// --- find ---
const target = tickets.find((t) => t.trackingId === 'HD-0003')
if (target) console.log('Found:', target.subject)

// --- some / every ---
console.log('Has urgent?', tickets.some((t) => t.priority === 'URGENT'))
console.log('All assigned?', tickets.every((t) => t.assigneeId !== null))

// --- reduce: total replies ---
const totalReplies = tickets.reduce(
  (sum, t) => sum + t.replyCount,
  0
)
console.log('Total replies:', totalReplies)

// --- reduce: group by status ---
const byStatus = tickets.reduce<Record<string, string[]>>((groups, t) => {
  const key = t.status
  const existing = groups[key] ?? []

  return { ...groups, [key]: [ ...existing, t.trackingId ] }
}, {})
console.log('By status:', byStatus)

// --- flatMap: all tags ---
const allTags = tickets.flatMap((t) => t.tags)
const uniqueTags = [ ...new Set(allTags) ]
console.log('Unique tags:', uniqueTags)
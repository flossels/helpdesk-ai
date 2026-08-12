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
  assignee: Assignee | null
  category: Category | null
  replyCount: number
  tags: string[]
  _count?: { replies: number }
}

const tickets: Ticket[] = [
  {
    id: '1',
    trackingId: 'HD-0001',
    subject: 'Cannot reset password',
    assignee: {
      id: 'usr-1',
      name: 'Maria Chen',
      email: 'maria@helpdesk.ai'
    },
    category: { id: 'cat-1', name: 'Auth' },
    replyCount: 3,
    tags: ['auth'],
    _count: { replies: 3 }
  },
  {
    id: '2',
    trackingId: 'HD-0002',
    subject: 'Feature request: export CSV',
    assignee: null,
    category: null,
    replyCount: 0,
    tags: []
  }
]

// --- Optional chaining ---
for (const ticket of tickets) {
  const assignee = ticket.assignee?.name ?? 'Unassigned'
  const category = ticket.category?.name ?? 'Uncategorized'
  const replies = ticket._count?.replies ?? 0
  const firstTag = ticket.tags?.[0] ?? 'no tags'

  console.log(`${ticket.trackingId}: ${ticket.subject}`)
  console.log(
    `  Assignee: ${assignee}`,
    `| Category: ${category}`,
    `| Replies: ${replies}`,
    `| First tag: ${firstTag}`
  )
}

// --- ?? vs || demonstration ---
const ticket = tickets[1]
const buggyCount = ticket?.replyCount || 99
const correctCount = ticket?.replyCount ?? 99

console.log(`\n?? vs || with replyCount = 0:`)
console.log(`  || gives: ${buggyCount}`)  // 99 ❌
console.log(`  ?? gives: ${correctCount}`) // 0 ✅

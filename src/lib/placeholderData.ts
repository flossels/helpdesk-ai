const TICKETS = [
  {
    id: '1',
    subject: 'Cannot reset password',
    status: 'OPEN',
    priority: 'HIGH',
    createdAt: new Date('2026-03-15T10:30:00')
  },
  {
    id: '2',
    subject: 'Billing invoice missing',
    status: 'OPEN',
    priority: 'MEDIUM',
    createdAt: new Date('2026-03-16T14:15:00')
  },
  {
    id: '3',
    subject: 'Feature request: dark mode',
    status: 'CLOSED',
    priority: 'LOW',
    createdAt: new Date('2026-03-10T09:00:00')
  }
]

type User = {
  id: string
  name: string
  role: 'admin' | 'agent'
}

const CURRENT_USER: User = {
  id: 'user-1',
  name: 'John Doe',
  role: 'admin'
}

const ARTICLES = [
  {
    slug: 'getting-started',
    title: 'Getting Started with HelpDesk AI',
    excerpt: 'Learn how to submit your first ticket.',
    content: 'Welcome to HelpDesk AI. To submit a ticket...'
  },
  {
    slug: 'account-setup',
    title: 'Setting Up Your Account',
    excerpt: 'Configure your profile and preferences.',
    content: 'After signing up, navigate to Settings...'
  },
  {
    slug: 'faq',
    title: 'Frequently Asked Questions',
    excerpt: 'Answers to common questions.',
    content: 'Q: How do I reset my password? A: ...'
  }
]

function delayExecution(delay: number) {
  return new Promise((r) => setTimeout(r, delay))
}

export async function getTickets() {
  await delayExecution(500)

  return TICKETS
}

export async function getTicketById(id: string) {
  await delayExecution(300)

  return TICKETS.find((t) => t.id === id) ?? null
}

export async function getCurrentUser() {
  await delayExecution(50)

  return CURRENT_USER
}

export async function getPublishedArticles() {
  await delayExecution(200)

  return ARTICLES
}

export async function getArticleBySlug(slug: string) {
  await delayExecution(200)

  return ARTICLES.find((a) => a.slug === slug) ?? null
}

export async function getTicketThread() {
  await delayExecution(2000)

  return [
    {
      id: '1',
      author: 'Customer',
      body: 'I cannot reset my password.',
      createdAt: new Date('2026-03-15T10:30:00')
    },
    {
      id: '2',
      author: 'Agent',
      body: 'Let me look into this for you.',
      createdAt: new Date('2026-03-15T10:35:00')
    }
  ]
}

export async function getTicketSummary() {
  await delayExecution(3000)

  return 'Customer unable to reset password. Likely a token expiration issue.'
}

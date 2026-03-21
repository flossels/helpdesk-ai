const TICKETS = [
  {
    id: '1',
    subject: 'Cannot reset password',
    status: 'open',
    priority: 'high',
    createdAt: new Date('2026-03-15T10:30:00')
  },
  {
    id: '2',
    subject: 'Billing invoice missing',
    status: 'open',
    priority: 'medium',
    createdAt: new Date('2026-03-16T14:15:00')
  },
  {
    id: '3',
    subject: 'Feature request: dark mode',
    status: 'closed',
    priority: 'low',
    createdAt: new Date('2026-03-10T09:00:00')
  }
]

const delayExecution = (delay: number) => new Promise((r) => setTimeout(r, delay))

export const getTickets = async () => {
  // Simulate database latency
  await delayExecution(500)

  return TICKETS
}

export const getTicketById = async (id: string) => {
  await delayExecution(300)

  return TICKETS.find((t) => t.id === id) ?? null
}

export const getTicketThread = async () => {
  // Simulate slow query
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

export const getTicketSummary = async () => {
  // Simulate expensive AI call
  await delayExecution(3000)

  return 'Customer unable to reset password. Likely a token expiration issue.'
}

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

export const getCurrentUser = async () => {
  await delayExecution(50)

  return CURRENT_USER
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

export const getPublishedArticles = async () => {
  await delayExecution(200)

  return ARTICLES
}

export const getArticleBySlug = async (slug: string) => {
  await delayExecution(200)

  return ARTICLES.find((a) => a.slug === slug) ?? null
}

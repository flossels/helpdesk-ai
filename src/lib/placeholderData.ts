import { CreateTicketInput } from '@/shared/types/ticket'
import { cache } from 'react'

export enum TicketStatus {
  Open = 'OPEN',
  InProgress = 'IN_PROGRESS',
  Waiting = 'WAITING',
  Resolved = 'RESOLVED',
  Closed = 'CLOSED'
}

export enum TicketPriority {
  Low = 'LOW',
  Medium = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

let nextTrackingNumber = 4

type Ticket = {
  id: string
  trackingId: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  categoryId: string
  assigneeId: string | null
  createdAt: Date
  updatedAt: Date
}

type Reply = {
  id: string
  ticketId: string
  author: string
  body: string
  createdAt: Date
}

const TICKETS: Ticket[] = [
  {
    id: 'ticket-1',
    trackingId: 'HD-001',
    subject: 'Cannot reset password',
    description: 'I requested a password reset but never received the email.',
    status: TicketStatus.Open,
    priority: TicketPriority.HIGH,
    categoryId: 'cat-1',
    assigneeId: null,
    createdAt: new Date('2026-03-15T10:30:00'),
    updatedAt: new Date('2026-03-15T10:30:00')
  },
  {
    id: 'ticket-2',
    trackingId: 'HD-002',
    subject: 'Billing invoice missing',
    description: 'My March invoice is not showing in the billing portal.',
    status: TicketStatus.InProgress,
    priority: TicketPriority.Medium,
    categoryId: 'cat-2',
    assigneeId: 'user-1',
    createdAt: new Date('2026-03-16T14:15:00'),
    updatedAt: new Date('2026-03-17T09:00:00')
  },
  {
    id: 'ticket-3',
    trackingId: 'HD-003',
    subject: 'Feature request: dark mode',
    description: 'Would love a dark mode option for the agent dashboard.',
    status: TicketStatus.Resolved,
    priority: TicketPriority.Low,
    categoryId: 'cat-3',
    assigneeId: 'user-1',
    createdAt: new Date('2026-03-10T09:00:00'),
    updatedAt: new Date('2026-03-12T16:00:00')
  }
]

const REPLIES: Reply[] = [
  {
    id: 'reply-1',
    ticketId: 'ticket-1',
    author: 'Customer',
    body: 'I cannot reset my password.',
    createdAt: new Date('2026-03-15T10:30:00')
  },
  {
    id: 'reply-2',
    ticketId: 'ticket-1',
    author: 'Agent',
    body: 'Let me look into this for you.',
    createdAt: new Date('2026-03-15T10:35:00')
  }
]

const delayExecution = (delay: number) => new Promise((r) => setTimeout(r, delay))

export const createTicketInStore = (input: CreateTicketInput) => {
  const trackingId = `HD-${String(nextTrackingNumber++).padStart(3, '0')}`
  const now = new Date()
  const ticket: Ticket = {
    id: `ticket-${Date.now()}`,
    trackingId,
    subject: input.subject,
    description: input.description,
    status: TicketStatus.Open,
    priority: 'MEDIUM',
    categoryId: input.categoryId,
    assigneeId: null,
    createdAt: now,
    updatedAt: now
  }
  TICKETS.push(ticket)

  return ticket
}

export const addReplyToStore = (input: { ticketId: string; author: string; body: string }) => {
  const reply: Reply = {
    id: `reply-${Date.now()}`,
    ticketId: input.ticketId,
    author: input.author,
    body: input.body,
    createdAt: new Date()
  }
  REPLIES.push(reply)

  return reply
}

export const updateTicketInStore = (id: string, update: Partial<Pick<Ticket, 'status' | 'assigneeId'>>) => {
  const ticket = TICKETS.find((t) => t.id === id)
  if (!ticket) return null

  Object.assign(ticket, {
    ...update,
    updatedAt: new Date()
  })

  return ticket
}

export type TicketFilters = {
  status?: string
  search?: string
}

export const getTickets = cache(async (filters: TicketFilters = {}) => {
  await delayExecution(500)

  return TICKETS.filter((ticket) => {
    if (filters.status && ticket.status !== filters.status) return false
    if (filters.search && !ticket.subject.toLowerCase().includes(filters.search.toLowerCase())) return false

    return true
  })
})

export const updateTicketsInStore = (ids: string[], update: Partial<Pick<Ticket, 'status' | 'assigneeId'>>) =>
  ids.reduce((count, id) => count + (updateTicketInStore(id, update) ? 1 : 0), 0)

export const getTicketById = cache(async (id: string) => {
  console.log(`Fetching ticket ${id}`)
  await delayExecution(300)

  return TICKETS.find((t) => t.id === id) ?? null
})

export const getTicketByTrackingId = cache(async (trackingId: string) => {
  await delayExecution(400)

  return TICKETS.find((t) => t.trackingId === trackingId) ?? null
})

export const getReplies = async (ticketId: string) => {
  await delayExecution(800)

  return REPLIES.filter((r) => r.ticketId === ticketId)
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

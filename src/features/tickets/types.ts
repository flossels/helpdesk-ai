import type { Category, Ticket, User } from '@/shared/types/database'
import type { TicketPriority, TicketStatus } from '@/shared/types/ticket'

export type TicketFilters = {
  status?: string
  search?: string
}

export type TicketListItem = Pick<Ticket, 'id' | 'trackingId' | 'subject' | 'slaDeadline' | 'createdAt' | 'updatedAt'> & {
  status: TicketStatus
  priority: TicketPriority
  category: Pick<Category, 'id' | 'name' | 'color'>
  assignee: Pick<User, 'id' | 'name' | 'image'> | null
  customer: Pick<User, 'id' | 'name' | 'email'>
  _count: { replies: number }
}

export type TicketReplyItem = {
  id: string
  author: string
  bodyHtml: string
  isAgent: boolean
  createdAt: Date
}

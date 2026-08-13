import type { TicketPriority, TicketStatus } from '@/shared/types/ticket'

export type TicketSearchResult = {
  trackingId: string
  subject: string
  status: TicketStatus
  priority: TicketPriority
}

export type ArticleResult = {
  slug: string
  title: string
  excerpt: string
}

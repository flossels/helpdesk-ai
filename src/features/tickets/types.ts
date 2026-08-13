export type TicketFilters = {
  status?: string
  search?: string
}

export type TicketWithRelations = {
  id: string
  trackingId: string
  subject: string
  status: string
  priority: string
  category: { id: string; name: string; color: string }
  assignee: { id: string; name: string; image: string | null } | null
  customer: { id: string; name: string; email: string }
  tags: { id: string; name: string; color: string }[]
  slaDeadline: Date | null
  createdAt: Date
  updatedAt: Date
  _count: { replies: number }
}

export type TicketListItem = Pick<
  TicketWithRelations,
  | 'id'
  | 'trackingId'
  | 'subject'
  | 'status'
  | 'priority'
  | 'category'
  | 'assignee'
  | 'customer'
  | 'slaDeadline'
  | 'createdAt'
  | 'updatedAt'
> & { _count: { replies: number } }

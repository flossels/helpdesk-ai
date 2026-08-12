import z from 'zod'

export const TICKET_STATUSES = ['OPEN', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED'] as const
export type TicketStatus = (typeof TICKET_STATUSES)[number]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TICKET_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const
export type TicketPriority = (typeof TICKET_PRIORITIES)[number]

export const createTicketSchema = z.object({
  subject: z.string().min(5).max(200),
  description: z.string().min(10),
  categoryId: z.string()
})

export type CreateTicketInput = z.infer<typeof createTicketSchema>

export const replyToTicketSchema = z.object({
  ticketId: z.string(),
  content: z.string().min(1).max(5000)
})

export type ReplyToTicketInput = z.infer<typeof replyToTicketSchema>

export const updateTicketStatusSchema = z.object({
  ticketId: z.string(),
  status: z.enum(TICKET_STATUSES)
})

export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>

export const bulkTicketUpdateSchema = z.object({
  ticketIds: z.array(z.string()).min(1).max(50),
  status: z.enum(TICKET_STATUSES)
})

export type BulkTicketUpdateInput = z.infer<typeof bulkTicketUpdateSchema>

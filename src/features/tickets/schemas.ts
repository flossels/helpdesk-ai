import z from 'zod'
import { TICKET_STATUSES } from '@/shared/types/ticket'

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
export const customerReplySchema = z.object({
  ticketId: z.string().min(1),
  body: z.string().min(1, 'Write a reply before sending.').max(5000, 'Keep the reply under 5000 characters.')
})
export type CustomerReplyInput = z.infer<typeof customerReplySchema>

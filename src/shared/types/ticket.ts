import { TicketStatus } from '@/lib/placeholderData'
import z from 'zod'

export const createTicketSchema = z.object({
  subject: z.string().min(5).max(200),
  description: z.string().min(10),
  categoryId: z.string()
})

export const replyToTicketSchema = z.object({
  ticketId: z.string(),
  content: z.string().min(1).max(5000)
})

export const updateTicketStatusSchema = z.object({
  ticketId: z.string(),
  status: z.enum(TicketStatus)
})

export const bulkTicketUpdateSchema = z.object({
  ticketIds: z.array(z.string()).min(1).max(50),
  status: z.enum(TicketStatus)
})

export type CreateTicketInput = z.infer<typeof createTicketSchema>

export type ReplyToTicketInput = z.infer<typeof replyToTicketSchema>

export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>

export type BulkTicketUpdateInput = z.infer<typeof bulkTicketUpdateSchema>

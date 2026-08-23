import z from 'zod'
import { TICKET_PRIORITIES, TICKET_STATUSES } from '@/shared/types/ticket'
import type { JSONContent } from '@tiptap/react'

export const createTicketSchema = z
  .object({
    subject: z
      .string()
      .min(5, 'Please summarize the issue in at least 5 characters.')
      .max(200, 'Keep the subject under 200 characters.'),
    description: z
      .string()
      .min(10, 'Please describe the issue in at least 10 characters.')
      .max(5000, 'Keep the description under 5000 characters.'),
    categoryId: z.string().min(1, 'Please choose a category.'),
    email: z.email('Please enter a valid email address.'),
    priority: z.enum(TICKET_PRIORITIES).optional(),
    attachmentIds: z.array(z.string()).optional()
  })
  .refine((data) => data.priority !== 'URGENT' || data.description.length >= 50, {
    message: 'Urgent tickets need a description of at least 50 characters.',
    path: ['description']
  })

export type CreateTicketInput = z.infer<typeof createTicketSchema>

export const publicTicketSchema = z
  .object({
    name: z.string().min(1, 'Please tell us your name.').max(100, 'Keep the name under 100 characters.'),
    email: z.email('Please enter a valid email address.'),
    subject: z
      .string()
      .min(5, 'Please summarize the issue in at least 5 characters.')
      .max(200, 'Keep the subject under 200 characters.'),
    description: z
      .string()
      .min(10, 'Please describe the issue in at least 10 characters.')
      .max(5000, 'Keep the description under 5000 characters.'),
    categoryId: z.string().min(1, 'Please choose a category.'),
    priority: z.enum(TICKET_PRIORITIES).optional(),
    attachmentIds: z.array(z.string()).optional()
  })
  .refine((data) => data.priority !== 'URGENT' || data.description.length >= 50, {
    message: 'Urgent tickets need a description of at least 50 characters.',
    path: ['description']
  })

export type PublicTicketInput = z.infer<typeof publicTicketSchema>

export const replyToTicketSchema = z.object({
  ticketId: z.string(),
  content: z.custom<JSONContent>((value) => typeof value === 'object' && value !== null && (value as JSONContent).type === 'doc'),
  contentText: z.string().min(1, 'Write a reply before sending.').max(5000, 'Keep the reply under 5000 characters.')
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

export const presignSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileType: z.enum(['image/png', 'image/jpeg', 'application/pdf']),
  fileSize: z
    .number()
    .int()
    .positive()
    .max(10 * 1024 * 1024),
  entityType: z.enum(['ticket', 'reply']),
  entityId: z.string().min(1),
  categoryId: z.string().min(1).optional()
})

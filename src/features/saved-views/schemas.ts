import z from 'zod'
import { TICKET_STATUSES } from '@/shared/types/ticket'

export const createSavedViewSchema = z.object({
  name: z.string().min(1, 'Give the view a name.').max(60),
  status: z.enum(TICKET_STATUSES).nullable().optional(),
  search: z.string().max(200).nullable().optional()
})

export type CreateSavedViewInput = z.infer<typeof createSavedViewSchema>

export const deleteSavedViewSchema = z.object({
  id: z.string().min(1)
})

export type DeleteSavedViewInput = z.infer<typeof deleteSavedViewSchema>

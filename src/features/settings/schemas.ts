import z from 'zod'

export const WEBHOOK_EVENTS = ['ticket.created', 'ticket.replied', 'ticket.status_changed'] as const

export const createWebhookSchema = z.object({
  url: z.url('Enter the full URL the events should be posted to.'),
  events: z.array(z.enum(WEBHOOK_EVENTS)).min(1, 'Choose at least one event.')
})

export type CreateWebhookInput = z.infer<typeof createWebhookSchema>

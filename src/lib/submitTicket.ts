import type { Ticket, TicketPriority } from '../types'

export type FormState = {
  message: string
  success: boolean
  ticket?: Ticket
} | null

export async function submitTicket(_prevState: FormState, formData: FormData): Promise<FormState> {
  const subject = formData.get('subject') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as TicketPriority

  if (!subject || subject.length < 3) return {
    message: 'Subject must be at least 3 characters.',
    success: false
  }

  if (!description || description.length < 10) return {
    message: 'Description must be at least 10 characters.',
    success: false
  }

  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    message: `Ticket "${subject}" created.`,
    success: true,
    ticket: {
      id: crypto.randomUUID(),
      trackingId: `HD-${Date.now()}`,
      subject,
      description,
      priority,
      status: 'OPEN',
      createdAt: new Date()
    }
  }
}
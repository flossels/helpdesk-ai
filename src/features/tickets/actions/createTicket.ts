'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'
import { createTicketInStore } from '@/shared/lib/placeholderData'
import { createTicketSchema } from '@/features/tickets/schemas'
import type { ActionResult } from '@/shared/types/actionResult'
import type { CreateTicketInput } from '@/features/tickets/schemas'

type ReturnType = ActionResult<{
  ticketId: string
  trackingId: string
}>

async function createTicket(input: CreateTicketInput): Promise<ReturnType> {
  try {
    // 1. Validate input
    const parsed = createTicketSchema.safeParse(input)

    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    // 2. Auth: placeholder
    // Auth + scope check arrives in Chapter 12

    // 3. Create the ticket
    const ticket = createTicketInStore(parsed.data)

    // 4. Invalidate cache
    revalidatePath('/tickets')

    // 5. Return success
    return {
      success: true,
      data: {
        ticketId: ticket.id,
        trackingId: ticket.trackingId
      }
    }
  } catch (error) {
    console.error('Failed to create ticket:', error)

    return {
      success: false,
      error: 'Could not create ticket.'
    }
  }
}

export async function createTicketAction(_prevState: ReturnType | null, formData: FormData): Promise<ReturnType> {
  const input: CreateTicketInput = {
    subject: formData.get('subject') as string,
    description: formData.get('description') as string,
    categoryId: formData.get('categoryId') as string
  }

  return createTicket(input)
}

'use server'

import { createTicketInStore } from '@/lib/placeholderData'
import { ActionResult } from '@/shared/types/ActionResult'
import { CreateTicketInput, createTicketSchema } from '@/shared/types/ticket'
import { revalidatePath } from 'next/cache'
import z from 'zod'

type ReturnType = ActionResult<{
  ticketId: string
  trackingId: string
}>

export const createTicketAction = async (_prevState: ReturnType | null, formData: FormData): Promise<ReturnType> => {
  const input: CreateTicketInput = {
    subject: formData.get('subject') as string,
    description: formData.get('description') as string,
    categoryId: formData.get('categoryId') as string
  }

  return createTicket(input)
}

const createTicket = async (input: CreateTicketInput): Promise<ReturnType> => {
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

    // 2. Auth — placeholder
    // TODO: Auth + scope check — Chapter 12

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

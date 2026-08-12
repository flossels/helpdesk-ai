'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'
import { createTicketSchema } from '@/shared/types/ticket'
import { createTicketInStore } from '@/lib/placeholderData'
import type { ActionResult } from '@/shared/types/actionResult'
import type { CreateTicketInput } from '@/shared/types/ticket'

type ReturnType = ActionResult<{
  ticketId: string
  trackingId: string
}>

async function createTicket(input: CreateTicketInput): Promise<ReturnType> {
  try {
    const parsed = createTicketSchema.safeParse(input)

    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    const ticket = createTicketInStore(parsed.data)

    revalidatePath('/tickets')

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

'use server'

import { revalidatePath, updateTag } from 'next/cache'
import z from 'zod'
import { updateTicketInStore } from '@/shared/lib/placeholderData'
import { updateTicketStatusSchema } from '@/features/tickets/schemas'
import type { ActionResult } from '@/shared/types/actionResult'
import type { TicketStatus } from '@/shared/types/ticket'
import type { UpdateTicketStatusInput } from '@/features/tickets/schemas'

type ReturnType = ActionResult<{
  ticketId: string
}>

async function updateTicketStatus(input: UpdateTicketStatusInput): Promise<ReturnType> {
  try {
    // 1. Validate input
    const parsed = updateTicketStatusSchema.safeParse(input)

    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    // 2. Auth: placeholder
    // Auth + scope check arrives in Chapter 12

    // 3. Update the ticket
    const ticket = updateTicketInStore(parsed.data.ticketId, { status: parsed.data.status })
    if (!ticket) return { success: false, error: 'Ticket not found.' }

    revalidatePath('/tickets')
    revalidatePath(`/tickets/${parsed.data.ticketId}`)
    updateTag(`tracking-${ticket.trackingId}`)

    return {
      success: true,
      data: { ticketId: ticket.id }
    }
  } catch (error) {
    console.error('Failed to update status:', error)

    return {
      success: false,
      error: 'Could not update status.'
    }
  }
}

export async function updateTicketStatusAction(_prevState: ReturnType | null, formData: FormData) {
  return updateTicketStatus({
    ticketId: formData.get('ticketId') as string,
    status: formData.get('status') as TicketStatus
  })
}

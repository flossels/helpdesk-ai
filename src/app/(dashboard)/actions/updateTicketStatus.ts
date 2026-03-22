'use server'

import { updateTicketInStore } from '@/lib/placeholderData'
import { ActionResult } from '@/shared/types/ActionResult'
import { UpdateTicketStatusInput, updateTicketStatusSchema } from '@/shared/types/ticket'
import { revalidatePath } from 'next/cache'

type ReturnType = Promise<
  ActionResult<{
    ticketId: string
  }>
>

const updateTicketStatus = async (input: UpdateTicketStatusInput): ReturnType => {
  try {
    const parsed = updateTicketStatusSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.'
      }
    }

    // TODO: Auth + scope check — Chapter 12
    const ticket = updateTicketInStore(parsed.data.ticketId, { status: parsed.data.status })
    if (!ticket) {
      return {
        success: false,
        error: 'Ticket not found.'
      }
    }

    revalidatePath('/tickets')
    revalidatePath(`/tickets/${parsed.data.ticketId}`)

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

export default updateTicketStatus

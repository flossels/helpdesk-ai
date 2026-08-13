'use server'

import { revalidatePath, updateTag } from 'next/cache'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { updateTicketStatusSchema } from '@/features/tickets/schemas'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { ActionResult } from '@/shared/types/actionResult'
import type { TicketStatus } from '@/shared/types/ticket'
import type { UpdateTicketStatusInput } from '@/features/tickets/schemas'

type ReturnType = ActionResult<{
  ticketId: string
}>

async function updateTicketStatus(input: UpdateTicketStatusInput): Promise<ReturnType> {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Not authenticated.' }
    if (!hasScope(user.scopes, 'tickets:write') || !user.organizationId) {
      return { success: false, error: 'Insufficient permissions.' }
    }

    const parsed = updateTicketStatusSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    const ticket = await db.ticket.findFirst({
      where: { id: parsed.data.ticketId, organizationId: user.organizationId },
      select: { id: true, trackingId: true }
    })
    if (!ticket) return { success: false, error: 'Ticket not found.' }

    await db.ticket.update({
      where: { id: ticket.id },
      data: { status: parsed.data.status },
      select: { id: true }
    })

    revalidatePath('/tickets')
    revalidatePath(`/tickets/${ticket.id}`)
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

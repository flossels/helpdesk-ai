'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { createTicketSchema } from '@/features/tickets/schemas'
import { generateTrackingId } from '@/features/tickets/lib/generateTrackingId'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { ActionResult } from '@/shared/types/actionResult'
import type { CreateTicketInput } from '@/features/tickets/schemas'

type ReturnType = ActionResult<{
  ticketId: string
  trackingId: string
}>

async function createTicket(input: CreateTicketInput): Promise<ReturnType> {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Not authenticated.' }
    if (!hasScope(user.scopes, 'tickets:write')) {
      return { success: false, error: 'Insufficient permissions.' }
    }

    const parsed = createTicketSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    const ticket = await db.ticket.create({
      data: {
        trackingId: await generateTrackingId(),
        subject: parsed.data.subject,
        description: parsed.data.description,
        categoryId: parsed.data.categoryId,
        customerId: user.id,
        organizationId: user.organizationId!
      },
      select: { id: true, trackingId: true }
    })

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

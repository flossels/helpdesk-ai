'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { createTicketSchema } from '@/features/tickets/schemas'
import { generateTrackingId } from '@/features/tickets/lib/generateTrackingId'
import type { ActionResult } from '@/shared/types/actionResult'
import type { CreateTicketInput } from '@/features/tickets/schemas'

type ReturnType = ActionResult<{
  ticketId: string
  trackingId: string
}>

async function createTicket(input: CreateTicketInput): Promise<ActionResult<{ ticketId: string; trackingId: string }>> {
  const parsed = createTicketSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid input.',
      fieldErrors: z.flattenError(parsed.error).fieldErrors
    }
  }

  const organization = await db.organization.findFirstOrThrow()
  const customer = await db.user.findFirstOrThrow({
    where: { role: 'CUSTOMER' }
  })

  const ticket = await db.ticket.create({
    data: {
      trackingId: await generateTrackingId(),
      subject: parsed.data.subject,
      description: parsed.data.description,
      categoryId: parsed.data.categoryId,
      customerId: customer.id,
      organizationId: organization.id
    },
    select: { id: true, trackingId: true }
  })

  revalidatePath('/tickets')

  return {
    success: true,
    data: { ticketId: ticket.id, trackingId: ticket.trackingId }
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

'use server'

import { after } from 'next/server'
import { revalidatePath } from 'next/cache'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { logActivity } from '@/shared/lib/logActivity'
import { dispatchWebhooks } from '@/shared/lib/dispatchWebhooks'
import { publishEvent } from '@/shared/lib/eventBus'
import { sendEmail } from '@/shared/lib/sendEmail'
import { createTicketSchema } from '@/features/tickets/schemas'
import { findOrCreateCustomer } from '@/features/tickets/lib/findOrCreateCustomer'
import { generateTrackingId } from '@/features/tickets/lib/generateTrackingId'
import { computeSlaDeadline } from '@/features/tickets/lib/computeSlaDeadline'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { TicketCreated } from '@/emails/TicketCreated'
import type { ActionResult } from '@/shared/types/actionResult'
import type { CreateTicketInput } from '@/features/tickets/schemas'

type ReturnType = ActionResult<{
  ticketId: string
  trackingId: string
}>

export async function createTicket(input: CreateTicketInput): Promise<ReturnType> {
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

    const customer = await findOrCreateCustomer(parsed.data.email)
    const priority = parsed.data.priority ?? 'MEDIUM'

    const ticket = await db.ticket.create({
      data: {
        trackingId: await generateTrackingId(),
        subject: parsed.data.subject,
        description: parsed.data.description,
        email: parsed.data.email,
        priority,
        slaDeadline: await computeSlaDeadline(user.organizationId!, priority),
        categoryId: parsed.data.categoryId,
        customerId: customer.id,
        organizationId: user.organizationId!
      },
      select: { id: true, trackingId: true }
    })

    if (parsed.data.attachmentIds?.length) {
      await db.attachment.updateMany({
        where: {
          id: { in: parsed.data.attachmentIds },
          uploadedById: user.id,
          entityType: 'ticket',
          status: 'ACTIVE'
        },
        data: { entityId: ticket.id }
      })
    }

    await logActivity({
      organizationId: user.organizationId!,
      userId: user.id,
      action: 'ticket.created',
      entityType: 'ticket',
      entityId: ticket.id
    })

    publishEvent({
      organizationId: user.organizationId!,
      type: 'ticket.created',
      data: { ticketId: ticket.id }
    })

    after(() =>
      dispatchWebhooks(user.organizationId!, {
        type: 'ticket.created',
        data: { ticketId: ticket.id, trackingId: ticket.trackingId }
      }).catch((error) => console.error('Webhook dispatch failed:', error))
    )

    const ticketUrl = `${process.env.APP_URL}/track/${ticket.trackingId}`
    after(() =>
      sendEmail({
        to: parsed.data.email,
        subject: `We received your ticket ${ticket.trackingId}`,
        template: TicketCreated({
          trackingId: ticket.trackingId,
          subject: parsed.data.subject,
          ticketUrl
        })
      }).catch((error) => console.error('Confirmation email failed:', error))
    )

    revalidatePath('/tickets')

    return {
      success: true,
      data: { ticketId: ticket.id, trackingId: ticket.trackingId }
    }
  } catch (error) {
    console.error('Failed to create ticket:', error)

    return {
      success: false,
      error: 'Could not create ticket.'
    }
  }
}

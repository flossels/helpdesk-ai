'use server'

import { unstable_rethrow } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { headers } from 'next/headers'
import z from 'zod'
import * as Sentry from '@sentry/nextjs'
import { db } from '@/shared/lib/db'
import { rateLimit } from '@/shared/lib/rateLimit'
import { logActivity } from '@/shared/lib/logActivity'
import { dispatchWebhooks } from '@/shared/lib/dispatchWebhooks'
import { publishEvent } from '@/shared/lib/eventBus'
import { sendEmail } from '@/shared/lib/sendEmail'
import { ANALYTICS_EVENTS } from '@/shared/lib/analytics/events'
import { trackServerEvent } from '@/shared/lib/analytics/mixpanelServer'
import { publicTicketSchema } from '@/features/tickets/schemas'
import { TicketCreated } from '@/emails/TicketCreated'
import { categorizeTicket } from '@/features/ai/actions/categorizeTicket'
import { findOrCreateCustomer } from '@/features/tickets/lib/findOrCreateCustomer'
import { generateTrackingId } from '@/features/tickets/lib/generateTrackingId'
import { computeSlaDeadline } from '@/features/tickets/lib/computeSlaDeadline'
import type { ActionResult } from '@/shared/types/actionResult'
import type { PublicTicketInput } from '@/features/tickets/schemas'

export async function submitPublicTicket(
  input: PublicTicketInput
): Promise<ActionResult<{ trackingId: string; ticketId: string }>> {
  try {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? headerList.get('x-real-ip') ?? 'unknown'
    const limit = await rateLimit(`submit:${ip}`, { maxRequests: 5, windowMs: 60_000 })
    if (!limit.allowed) {
      return { success: false, error: 'Too many submissions. Please wait a moment.' }
    }

    const parsed = publicTicketSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    const category = await db.category.findUnique({
      where: { id: parsed.data.categoryId },
      select: { organizationId: true }
    })
    if (!category) {
      return { success: false, error: 'Invalid category.' }
    }

    const customer = await findOrCreateCustomer(parsed.data.email, parsed.data.name)
    const priority = parsed.data.priority ?? 'MEDIUM'

    const ticket = await db.ticket.create({
      data: {
        trackingId: await generateTrackingId(),
        subject: parsed.data.subject,
        description: parsed.data.description,
        email: parsed.data.email,
        priority,
        slaDeadline: await computeSlaDeadline(category.organizationId, priority),
        categoryId: parsed.data.categoryId,
        customerId: customer.id,
        organizationId: category.organizationId
      },
      select: { id: true, trackingId: true }
    })

    if (parsed.data.attachmentIds?.length) {
      await db.attachment.updateMany({
        where: {
          id: { in: parsed.data.attachmentIds },
          uploadedById: null,
          organizationId: category.organizationId,
          entityType: 'ticket',
          status: 'ACTIVE'
        },
        data: { entityId: ticket.id }
      })
    }

    await logActivity({
      organizationId: category.organizationId,
      userId: customer.id,
      action: 'ticket.created',
      entityType: 'ticket',
      entityId: ticket.id
    })

    publishEvent({
      organizationId: category.organizationId,
      type: 'ticket.created',
      data: { ticketId: ticket.id }
    })

    after(() =>
      dispatchWebhooks(category.organizationId, {
        type: 'ticket.created',
        data: { ticketId: ticket.id, trackingId: ticket.trackingId }
      }).catch((error) => {
        Sentry.captureException(error)
        console.error('Webhook dispatch failed:', error)
      })
    )

    after(() => categorizeTicket(ticket.id, category.organizationId))

    after(() =>
      trackServerEvent(ANALYTICS_EVENTS.ticketCreated, category.organizationId, {
        priority,
        source: 'public'
      })
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
      }).catch((error) => {
        Sentry.captureException(error)
        console.error('Confirmation email failed:', error)
      })
    )

    revalidatePath('/tickets')

    return {
      success: true,
      data: { ticketId: ticket.id, trackingId: ticket.trackingId }
    }
  } catch (error) {
    unstable_rethrow(error)
    Sentry.captureException(error)
    console.error('Public ticket submission failed:', error)
    return { success: false, error: 'Could not submit the ticket.' }
  }
}

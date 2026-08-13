'use server'

import { unstable_rethrow } from 'next/navigation'
import { after } from 'next/server'
import { revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { logActivity } from '@/shared/lib/logActivity'
import { dispatchWebhooks } from '@/shared/lib/dispatchWebhooks'
import { ANALYTICS_EVENTS } from '@/shared/lib/analytics/events'
import { trackServerEvent } from '@/shared/lib/analytics/mixpanelServer'
import { publishEvent } from '@/shared/lib/eventBus'
import { sendLocalizedEmail } from '@/shared/lib/sendLocalizedEmail'
import { createTicketSchema } from '@/features/tickets/schemas'
import { categorizeTicket } from '@/features/ai/actions/categorizeTicket'
import { findOrCreateCustomer } from '@/features/tickets/lib/findOrCreateCustomer'
import { generateTrackingId } from '@/features/tickets/lib/generateTrackingId'
import { computeSlaDeadline } from '@/features/tickets/lib/computeSlaDeadline'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { resolveRecipientLocale } from '@/i18n/resolveLocale'
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

    after(() => categorizeTicket(ticket.id, user.organizationId!))

    after(() => trackServerEvent(ANALYTICS_EVENTS.ticketCreated, user.organizationId!, { priority }))

    after(() =>
      dispatchWebhooks(user.organizationId!, {
        type: 'ticket.created',
        data: { ticketId: ticket.id, trackingId: ticket.trackingId }
      }).catch((error) => {
        Sentry.captureException(error)
        console.error('Webhook dispatch failed:', error)
      })
    )

    const ticketUrl = `${process.env.APP_URL}/track/${ticket.trackingId}`
    const locale = await resolveRecipientLocale(customer.preferredLocale)
    after(() =>
      sendLocalizedEmail({
        to: parsed.data.email,
        locale,
        subjectKey: 'ticketCreatedSubject',
        trackingId: ticket.trackingId,
        template: (t) =>
          TicketCreated({
            heading: t('ticketCreatedHeading'),
            body: t('ticketCreatedBody', {
              trackingId: ticket.trackingId,
              subject: parsed.data.subject
            }),
            cta: t('trackCta'),
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
    console.error('Failed to create ticket:', error)

    return {
      success: false,
      error: 'Could not create ticket.'
    }
  }
}

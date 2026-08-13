'use server'

import { unstable_rethrow } from 'next/navigation'
import { revalidatePath, updateTag } from 'next/cache'
import { after } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { logActivity } from '@/shared/lib/logActivity'
import { dispatchWebhooks } from '@/shared/lib/dispatchWebhooks'
import { ANALYTICS_EVENTS } from '@/shared/lib/analytics/events'
import { trackServerEvent } from '@/shared/lib/analytics/mixpanelServer'
import { publishEvent } from '@/shared/lib/eventBus'
import { sendEmail } from '@/shared/lib/sendEmail'
import { updateTicketStatusSchema } from '@/features/tickets/schemas'
import { embedTicket } from '@/features/ai/actions/embedTicket'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { TicketResolved } from '@/emails/TicketResolved'
import type { ActionResult } from '@/shared/types/actionResult'
import type { UpdateTicketStatusInput } from '@/features/tickets/schemas'

type ReturnType = ActionResult<{
  ticketId: string
}>

export async function updateTicketStatus(input: UpdateTicketStatusInput): Promise<ReturnType> {
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
      select: { id: true, trackingId: true, subject: true, email: true, status: true }
    })
    if (!ticket) return { success: false, error: 'Ticket not found.' }

    await db.ticket.update({
      where: { id: ticket.id },
      data: { status: parsed.data.status },
      select: { id: true }
    })

    await logActivity({
      organizationId: user.organizationId!,
      userId: user.id,
      action: 'ticket.status_changed',
      entityType: 'ticket',
      entityId: ticket.id
    })

    publishEvent({
      organizationId: user.organizationId!,
      type: 'ticket.status_changed',
      data: { ticketId: ticket.id }
    })

    after(() =>
      dispatchWebhooks(user.organizationId!, {
        type: 'ticket.status_changed',
        data: { ticketId: ticket.id, trackingId: ticket.trackingId }
      }).catch((error) => {
        Sentry.captureException(error)
        console.error('Webhook dispatch failed:', error)
      })
    )

    if (parsed.data.status === 'RESOLVED' || parsed.data.status === 'CLOSED') {
      after(() => embedTicket(ticket.id, user.organizationId!))
    }

    if (parsed.data.status === 'RESOLVED' && ticket.status !== 'RESOLVED') {
      after(() => trackServerEvent(ANALYTICS_EVENTS.ticketResolved, user.organizationId!))
    }

    if (parsed.data.status === 'RESOLVED' && ticket.status !== 'RESOLVED' && ticket.email) {
      const ticketUrl = `${process.env.APP_URL}/track/${ticket.trackingId}`
      after(() =>
        sendEmail({
          to: ticket.email as string,
          subject: `Your ticket ${ticket.trackingId} is resolved`,
          template: TicketResolved({
            trackingId: ticket.trackingId,
            subject: ticket.subject,
            ticketUrl,
            ratingUrlFor: (score: number) => `${ticketUrl}?rating=${score}`
          })
        }).catch((error) => {
          Sentry.captureException(error)
          console.error('Resolution email failed:', error)
        })
      )
    }

    revalidatePath('/tickets')
    revalidatePath(`/tickets/${ticket.id}`)
    updateTag(`tracking-${ticket.trackingId}`)

    return {
      success: true,
      data: { ticketId: ticket.id }
    }
  } catch (error) {
    unstable_rethrow(error)
    Sentry.captureException(error)
    console.error('Failed to update status:', error)
    return {
      success: false,
      error: 'Could not update status.'
    }
  }
}

import 'server-only'

import * as Sentry from '@sentry/nextjs'
import { db } from '@/shared/lib/db'
import { logActivity } from '@/shared/lib/logActivity'
import { sendEmail } from '@/shared/lib/sendEmail'
import { SlaWarning } from '@/emails/SlaWarning'

export async function warnSlaBreach(ticketId: string, organizationId: string, userId?: string) {
  const ticket = await db.ticket.findFirst({
    where: { id: ticketId, organizationId },
    select: {
      id: true,
      trackingId: true,
      subject: true,
      slaDeadline: true,
      status: true,
      assignee: { select: { id: true, email: true } }
    }
  })
  if (!ticket?.slaDeadline) return
  if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') return

  const assignee = ticket.assignee
  if (!assignee?.email) return

  const alreadyWarned = await db.activityLog.findFirst({
    where: { entityType: 'ticket', entityId: ticket.id, action: 'sla.warning' },
    select: { id: true }
  })
  if (alreadyWarned) return

  await logActivity({
    organizationId,
    userId: userId ?? assignee.id,
    action: 'sla.warning',
    entityType: 'ticket',
    entityId: ticket.id
  })

  const minutesLeft = Math.max(0, Math.floor((ticket.slaDeadline.getTime() - Date.now()) / 60_000))

  await sendEmail({
    to: assignee.email,
    subject: `${ticket.trackingId} is due in ${minutesLeft} minutes`,
    template: SlaWarning({
      trackingId: ticket.trackingId,
      subject: ticket.subject,
      minutesLeft,
      ticketUrl: `${process.env.APP_URL}/tickets/${ticket.id}`
    })
  }).catch((error) => {
    Sentry.captureException(error)
    console.error('SLA warning email failed:', error)
  })
}

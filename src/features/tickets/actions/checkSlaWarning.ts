'use server'

import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { logActivity } from '@/shared/lib/logActivity'
import { sendEmail } from '@/shared/lib/sendEmail'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { SlaWarning } from '@/emails/SlaWarning'

export async function checkSlaWarning(ticketId: string) {
  try {
    const user = await getCurrentUser()
    if (!user?.organizationId) return
    if (!hasScope(user.scopes, 'tickets:read')) return

    const ticket = await db.ticket.findFirst({
      where: { id: ticketId, organizationId: user.organizationId },
      select: {
        id: true,
        trackingId: true,
        subject: true,
        slaDeadline: true,
        status: true,
        assignee: { select: { email: true } }
      }
    })
    if (!ticket?.slaDeadline) return
    if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') return

    const assigneeEmail = ticket.assignee?.email
    if (!assigneeEmail) return

    const alreadyWarned = await db.activityLog.findFirst({
      where: { entityType: 'ticket', entityId: ticket.id, action: 'sla.warning' },
      select: { id: true }
    })
    if (alreadyWarned) return

    await logActivity({
      organizationId: user.organizationId,
      userId: user.id,
      action: 'sla.warning',
      entityType: 'ticket',
      entityId: ticket.id
    })

    const minutesLeft = Math.max(0, Math.floor((ticket.slaDeadline.getTime() - Date.now()) / 60_000))

    await sendEmail({
      to: assigneeEmail,
      subject: `${ticket.trackingId} is due in ${minutesLeft} minutes`,
      template: SlaWarning({
        trackingId: ticket.trackingId,
        subject: ticket.subject,
        minutesLeft,
        ticketUrl: `${process.env.APP_URL}/tickets/${ticket.id}`
      })
    }).catch((error) => console.error('SLA warning email failed:', error))
  } catch (error) {
    console.error('SLA warning check failed:', error)
  }
}

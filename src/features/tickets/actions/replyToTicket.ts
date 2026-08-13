'use server'

import { unstable_rethrow } from 'next/navigation'
import { after } from 'next/server'
import { revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import { renderToHTMLString } from '@tiptap/static-renderer'
import StarterKit from '@tiptap/starter-kit'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { logActivity } from '@/shared/lib/logActivity'
import { dispatchWebhooks } from '@/shared/lib/dispatchWebhooks'
import { publishEvent } from '@/shared/lib/eventBus'
import { sendLocalizedEmail } from '@/shared/lib/sendLocalizedEmail'
import { replyToTicketSchema } from '@/features/tickets/schemas'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { resolveRecipientLocale } from '@/i18n/resolveLocale'
import { AgentReply } from '@/emails/AgentReply'
import type { ActionResult } from '@/shared/types/actionResult'
import type { ReplyToTicketInput } from '@/features/tickets/schemas'

type ReturnType = ActionResult<{
  replyId: string
}>

export async function replyToTicket(input: ReplyToTicketInput): Promise<ReturnType> {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Not authenticated.' }
    if (!hasScope(user.scopes, 'tickets:write') || !user.organizationId) {
      return { success: false, error: 'Insufficient permissions.' }
    }

    const parsed = replyToTicketSchema.safeParse(input)

    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    const ticket = await db.ticket.findFirst({
      where: { id: parsed.data.ticketId, organizationId: user.organizationId },
      select: {
        id: true,
        trackingId: true,
        email: true,
        customer: { select: { preferredLocale: true } }
      }
    })
    if (!ticket) return { success: false, error: 'Ticket not found.' }

    const reply = await db.ticketReply.create({
      data: {
        ticketId: ticket.id,
        authorId: user.id,
        content: parsed.data.content,
        contentText: parsed.data.contentText
      },
      select: { id: true }
    })

    await logActivity({
      organizationId: user.organizationId!,
      userId: user.id,
      action: 'ticket.replied',
      entityType: 'ticket',
      entityId: ticket.id
    })

    publishEvent({
      organizationId: user.organizationId!,
      type: 'ticket.replied',
      data: { ticketId: ticket.id }
    })

    after(() =>
      dispatchWebhooks(user.organizationId!, {
        type: 'ticket.replied',
        data: { ticketId: ticket.id, trackingId: ticket.trackingId }
      }).catch((error) => {
        Sentry.captureException(error)
        console.error('Webhook dispatch failed:', error)
      })
    )

    if (ticket.email) {
      const ticketUrl = `${process.env.APP_URL}/track/${ticket.trackingId}`
      const replyHtml = renderToHTMLString({
        content: parsed.data.content,
        extensions: [StarterKit]
      })
      const locale = await resolveRecipientLocale(ticket.customer?.preferredLocale)

      after(() =>
        sendLocalizedEmail({
          to: ticket.email as string,
          locale,
          subjectKey: 'agentReplySubject',
          trackingId: ticket.trackingId,
          template: (t) =>
            AgentReply({
              heading: t('agentReplyHeading', {
                agentName: user.name ?? 'Support',
                trackingId: ticket.trackingId
              }),
              replyHtml,
              cta: t('viewConversationCta'),
              ticketUrl
            })
        }).catch((error) => {
          Sentry.captureException(error)
          console.error('Reply email failed:', error)
        })
      )
    }

    revalidatePath(`/tickets/${parsed.data.ticketId}`)

    return {
      success: true,
      data: { replyId: reply.id }
    }
  } catch (error) {
    unstable_rethrow(error)
    Sentry.captureException(error)
    console.error('Failed to add reply:', error)
    return {
      success: false,
      error: 'Could not post reply.'
    }
  }
}

'use server'

import { unstable_rethrow } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { categorizationSchema } from '@/features/ai/schemas/categorization'
import type { ActionResult } from '@/shared/types/actionResult'

const inputSchema = z.object({
  ticketId: z.string().min(1),
  decision: z.enum(['apply', 'dismiss'])
})

export async function resolveCategorization(input: z.infer<typeof inputSchema>): Promise<ActionResult<{ ticketId: string }>> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Invalid request.' }

  const user = await getCurrentUser()
  if (!user?.organizationId || !hasScope(user.scopes, 'tickets:write')) {
    return { success: false, error: 'You cannot change this ticket.' }
  }

  const { ticketId, decision } = parsed.data

  try {
    const latest = await db.activityLog.findFirst({
      where: {
        organizationId: user.organizationId,
        entityType: 'ticket',
        entityId: ticketId,
        action: { startsWith: 'ai.categoriz' }
      },
      orderBy: { createdAt: 'desc' },
      select: { action: true, metadata: true }
    })
    if (latest?.action !== 'ai.categorization_suggested') {
      return { success: false, error: 'There is no open suggestion for this ticket.' }
    }

    const suggestion = categorizationSchema.safeParse(latest.metadata)
    if (!suggestion.success) return { success: false, error: 'The suggestion is unreadable.' }

    if (decision === 'apply') {
      const category = await db.category.findFirst({
        where: { organizationId: user.organizationId, name: suggestion.data.category },
        select: { id: true }
      })
      if (!category) return { success: false, error: 'That category no longer exists.' }

      const org = await db.organization.findUnique({
        where: { id: user.organizationId },
        select: { autoSentimentEnabled: true }
      })

      await db.ticket.update({
        where: { id: ticketId, organizationId: user.organizationId },
        data: {
          categoryId: category.id,
          priority: suggestion.data.priority,
          ...(org?.autoSentimentEnabled ? { sentiment: suggestion.data.sentiment } : {})
        }
      })
    }

    await db.activityLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: decision === 'apply' ? 'ai.categorized' : 'ai.categorization_dismissed',
        entityType: 'ticket',
        entityId: ticketId,
        metadata: latest.metadata ?? {}
      }
    })

    revalidatePath(`/tickets/${ticketId}`)
    return { success: true, data: { ticketId } }
  } catch (error) {
    unstable_rethrow(error)
    Sentry.captureException(error)
    console.error('Resolving categorization failed:', error)
    return { success: false, error: 'Could not resolve the suggestion.' }
  }
}

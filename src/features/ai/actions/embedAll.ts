'use server'

import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { embedArticle } from '@/features/ai/actions/embedArticle'
import { embedTicket } from '@/features/ai/actions/embedTicket'
import type { ActionResult } from '@/shared/types/actionResult'

export async function embedAllContent(): Promise<ActionResult<{ articles: number; tickets: number }>> {
  const user = await getCurrentUser()
  if (!user?.organizationId || !hasScope(user.scopes, 'ai:configure')) {
    return { success: false, error: 'You cannot re-index content.' }
  }
  const organizationId = user.organizationId

  const articles = await db.article.findMany({
    where: { organizationId, status: 'PUBLISHED' },
    select: { id: true }
  })
  for (const article of articles) {
    await embedArticle(article.id, organizationId)
  }

  const tickets = await db.ticket.findMany({
    where: { organizationId, status: { in: ['RESOLVED', 'CLOSED'] } },
    select: { id: true }
  })
  for (const ticket of tickets) {
    await embedTicket(ticket.id, organizationId)
  }

  return {
    success: true,
    data: { articles: articles.length, tickets: tickets.length }
  }
}

'use server'

import { unstable_rethrow } from 'next/navigation'
import { after } from 'next/server'
import { revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { ANALYTICS_EVENTS } from '@/shared/lib/analytics/events'
import { trackServerEvent } from '@/shared/lib/analytics/mixpanelServer'
import { embedArticle } from '@/features/ai/actions/embedArticle'
import { revalidateArticles } from '@/features/knowledge/actions/revalidateArticles'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { ActionResult } from '@/shared/types/actionResult'

const inputSchema = z.object({ articleId: z.string().min(1) })

export async function publishArticle(input: z.infer<typeof inputSchema>): Promise<ActionResult<{ slug: string }>> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Invalid request.' }

  const user = await getCurrentUser()
  if (!user?.organizationId || !hasScope(user.scopes, 'knowledge:publish')) {
    return { success: false, error: 'You cannot publish articles.' }
  }
  const organizationId = user.organizationId

  try {
    const article = await db.article.update({
      where: { id: parsed.data.articleId, organizationId },
      data: { status: 'PUBLISHED', isPublic: true },
      select: { id: true, slug: true }
    })

    after(() => embedArticle(article.id, organizationId))

    after(() => trackServerEvent(ANALYTICS_EVENTS.articlePublished, organizationId))

    await revalidateArticles()

    revalidatePath('/knowledge')
    return { success: true, data: { slug: article.slug } }
  } catch (error) {
    unstable_rethrow(error)
    Sentry.captureException(error)
    console.error('Publishing article failed:', error)
    return { success: false, error: 'Could not publish the article.' }
  }
}

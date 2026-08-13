'use server'

import { after } from 'next/server'
import { revalidatePath } from 'next/cache'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { embedArticle } from '@/features/ai/actions/embedArticle'
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

    revalidatePath('/knowledge')
    return { success: true, data: { slug: article.slug } }
  } catch (error) {
    console.error('Publishing article failed:', error)
    return { success: false, error: 'Could not publish the article.' }
  }
}

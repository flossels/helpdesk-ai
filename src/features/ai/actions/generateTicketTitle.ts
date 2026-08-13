'use server'

import { after } from 'next/server'
import { generateText } from 'ai'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { getModel, resolveModelId } from '@/features/ai/lib/getModel'
import { trackUsage } from '@/features/ai/lib/trackUsage'
import { isWithinBudget } from '@/features/ai/lib/checkBudget'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { TITLE_PROMPT } from '@/features/ai/lib/prompts'
import type { ActionResult } from '@/shared/types/actionResult'

export async function generateTicketTitle(description: string): Promise<ActionResult<{ title: string }>> {
  const user = await getCurrentUser()
  if (!user?.organizationId) return { success: false, error: 'Not authenticated.' }
  if (!hasScope(user.scopes, 'ai:use')) return { success: false, error: 'Insufficient permissions.' }
  if (!(await isWithinBudget(user.organizationId))) return { success: false, error: 'Token budget exceeded.' }

  const org = await db.organization.findUnique({
    where: { id: user.organizationId },
    select: { aiModel: true }
  })
  if (!org) return { success: false, error: 'Organization not found.' }

  const modelId = resolveModelId(org.aiModel)
  const organizationId = user.organizationId

  try {
    const result = await generateText({
      model: getModel(modelId),
      instructions: TITLE_PROMPT,
      prompt: description,
      maxOutputTokens: 100
    })

    const { inputTokens, outputTokens, totalTokens } = result.usage
    after(() =>
      trackUsage({
        organizationId,
        userId: user.id,
        model: modelId,
        feature: 'title',
        inputTokens: inputTokens ?? 0,
        outputTokens: outputTokens ?? 0,
        totalTokens: totalTokens ?? 0
      }).catch((error) => console.error('Usage tracking failed:', error))
    )

    return { success: true, data: { title: result.text.trim() } }
  } catch (error) {
    console.error('Title generation failed:', error)
    return { success: false, error: 'Could not suggest a title right now.' }
  }
}

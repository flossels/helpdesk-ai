'use server'

import { after } from 'next/server'
import { generateText } from 'ai'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { getModel } from '@/features/ai/lib/getModel'
import { trackUsage } from '@/features/ai/lib/trackUsage'
import { isWithinBudget } from '@/features/ai/lib/checkBudget'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { routing } from '@/i18n/routing'
import { LOCALE_NAMES } from '@/i18n/localeNames'
import type { ActionResult } from '@/shared/types/actionResult'

const translateReplySchema = z.object({
  content: z.string().min(1).max(10000),
  targetLocale: z.enum(routing.locales)
})

type TranslateReplyInput = z.infer<typeof translateReplySchema>

export async function translateReply(input: TranslateReplyInput): Promise<ActionResult<{ translated: string }>> {
  const user = await getCurrentUser()
  if (!user?.organizationId) {
    return { success: false, error: 'Not authenticated.' }
  }
  if (!hasScope(user.scopes, 'ai:use')) {
    return { success: false, error: 'Insufficient permissions.' }
  }

  const parsed = translateReplySchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid input.',
      fieldErrors: z.flattenError(parsed.error).fieldErrors
    }
  }

  if (!(await isWithinBudget(user.organizationId))) {
    return { success: false, error: 'Token budget exceeded.' }
  }

  const org = await db.organization.findUnique({
    where: { id: user.organizationId },
    select: { aiModel: true }
  })
  if (!org) return { success: false, error: 'Organization not found.' }

  const { content, targetLocale } = parsed.data

  const result = await generateText({
    model: getModel(org.aiModel),
    instructions:
      'You are a professional translator for a customer support platform. ' +
      `Translate the support reply into ${LOCALE_NAMES[targetLocale]}. ` +
      'Preserve the tone and formality level, keep technical terms and any ' +
      'markdown formatting unchanged, do not add or remove information, and ' +
      'return the text unchanged if it is already in the target language.',
    prompt: content,
    maxOutputTokens: 400
  })

  const organizationId = user.organizationId
  const { inputTokens, outputTokens, totalTokens } = result.usage
  after(() =>
    trackUsage({
      organizationId,
      userId: user.id,
      model: org.aiModel,
      feature: 'translation',
      inputTokens: inputTokens ?? 0,
      outputTokens: outputTokens ?? 0,
      totalTokens: totalTokens ?? 0
    })
  )

  return { success: true, data: { translated: result.text.trim() } }
}

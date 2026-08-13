import 'server-only'
import { cache } from 'react'
import { db } from '@/shared/lib/db'
import { AVAILABLE_MODELS } from '@/features/ai/lib/aiConfig'
import { getMonthlyTokenUsage } from '@/features/ai/lib/checkBudget'
import type { AiSettingsView } from '@/features/ai/types'

export const getAiSettings = cache(async (organizationId: string): Promise<AiSettingsView | null> => {
  const org = await db.organization.findUnique({
    where: { id: organizationId },
    select: {
      aiModel: true,
      tokenBudget: true,
      autoCategorizationEnabled: true,
      autoSentimentEnabled: true
    }
  })
  if (!org) return null

  return {
    ...org,
    usedThisMonth: await getMonthlyTokenUsage(organizationId),
    models: AVAILABLE_MODELS
  }
})

import type { AvailableModel } from '@/features/ai/lib/aiConfig'

export type AiSettingsView = {
  aiModel: string
  tokenBudget: number
  autoCategorizationEnabled: boolean
  autoSentimentEnabled: boolean
  usedThisMonth: number
  models: AvailableModel[]
}

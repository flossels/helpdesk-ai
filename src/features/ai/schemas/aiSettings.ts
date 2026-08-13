import z from 'zod'
import { AVAILABLE_MODELS } from '@/features/ai/lib/aiConfig'

const MODEL_IDS = AVAILABLE_MODELS.map((model) => model.id)

export const aiSettingsSchema = z.object({
  aiModel: z.enum(MODEL_IDS),
  tokenBudget: z.number().int().min(0),
  autoCategorizationEnabled: z.boolean(),
  autoSentimentEnabled: z.boolean()
})

export type AiSettingsInput = z.infer<typeof aiSettingsSchema>

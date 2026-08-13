import 'server-only'
import { db } from '@/shared/lib/db'

export type TrackUsageInput = {
  organizationId: string
  userId?: string
  model: string
  feature: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
}

export async function trackUsage(input: TrackUsageInput) {
  if (input.totalTokens === 0) return
  await db.aiUsageLog.create({ data: input })
}

import 'server-only'
import { db } from '@/shared/lib/db'

// The window is a calendar month in UTC, so a deployment and a laptop in
// different timezones agree on when the month turned over.
function startOfMonthUtc() {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
}

export async function getMonthlyTokenUsage(organizationId: string) {
  const used = await db.aiUsageLog.aggregate({
    where: { organizationId, createdAt: { gte: startOfMonthUtc() } },
    _sum: { totalTokens: true }
  })

  return used._sum.totalTokens ?? 0
}

export async function isWithinBudget(organizationId: string) {
  const org = await db.organization.findUnique({
    where: { id: organizationId },
    select: { tokenBudget: true }
  })
  if (!org) return false

  return (await getMonthlyTokenUsage(organizationId)) < org.tokenBudget
}

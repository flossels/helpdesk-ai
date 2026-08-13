import 'server-only'
import { db } from '@/shared/lib/db'

type StepUsage = { usage: { totalTokens: number | undefined } }

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

export async function getRemainingBudget(organizationId: string) {
  const org = await db.organization.findUnique({
    where: { id: organizationId },
    select: { tokenBudget: true }
  })
  if (!org) return 0

  const used = await getMonthlyTokenUsage(organizationId)
  return Math.max(0, org.tokenBudget - used)
}

export function budgetExceeded(remaining: number) {
  return ({ steps }: { steps: ReadonlyArray<StepUsage> }) =>
    steps.reduce((spent, step) => spent + (step.usage.totalTokens ?? 0), 0) >= remaining
}

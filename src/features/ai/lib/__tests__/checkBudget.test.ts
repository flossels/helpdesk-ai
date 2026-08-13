import { beforeEach, describe, expect, it, vi } from 'vitest'

import { mockDb } from '@/tests/mocks/db'

import { budgetExceeded, getRemainingBudget } from '@/features/ai/lib/checkBudget'

function step(totalTokens: number | undefined) {
  return { usage: { totalTokens } }
}

describe('getRemainingBudget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns what is left of the monthly ceiling', async () => {
    mockDb.organization.findUnique.mockResolvedValue({ tokenBudget: 100_000 } as never)
    mockDb.aiUsageLog.aggregate.mockResolvedValue({ _sum: { totalTokens: 40_000 } } as never)

    expect(await getRemainingBudget('org-1')).toBe(60_000)
  })

  it('never reports a negative allowance', async () => {
    mockDb.organization.findUnique.mockResolvedValue({ tokenBudget: 10_000 } as never)
    mockDb.aiUsageLog.aggregate.mockResolvedValue({ _sum: { totalTokens: 25_000 } } as never)

    expect(await getRemainingBudget('org-1')).toBe(0)
  })

  it('returns nothing for an unknown organization', async () => {
    mockDb.organization.findUnique.mockResolvedValue(null as never)

    expect(await getRemainingBudget('org-nope')).toBe(0)
  })
})

describe('budgetExceeded', () => {
  it('lets the turn continue while it stays inside the allowance', () => {
    expect(budgetExceeded(1_000)({ steps: [step(300), step(400)] })).toBe(false)
  })

  it('stops the loop once the accumulated steps reach the allowance', () => {
    expect(budgetExceeded(1_000)({ steps: [step(300), step(400), step(350)] })).toBe(true)
  })

  it('counts a step that reported no usage as free', () => {
    expect(budgetExceeded(100)({ steps: [step(undefined)] })).toBe(false)
  })
})

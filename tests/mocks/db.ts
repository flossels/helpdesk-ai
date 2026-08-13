import { vi } from 'vitest'
import { db } from '@/shared/lib/db'

// Replace the Prisma client with a fully mocked surface. Every model
// method is a `vi.fn()` we can configure per test with
// `mockResolvedValue` / `mockRejectedValue`.
vi.mock('@/shared/lib/db', () => ({
  db: {
    ticket: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      count: vi.fn()
    },
    article: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn()
    },
    category: { findMany: vi.fn() },
    organization: { findUnique: vi.fn() },
    slaRule: { findUnique: vi.fn() },
    attachment: { updateMany: vi.fn() },
    orgMember: { findUnique: vi.fn() },
    aiUsageLog: { aggregate: vi.fn(), create: vi.fn() },
    activityLog: { create: vi.fn() },
    $executeRaw: vi.fn(),
    $queryRaw: vi.fn(),
    // A transaction runs its callback synchronously against this same
    // mock. That covers the happy path; it does not model a rollback.
    $transaction: vi.fn((fn: (tx: unknown) => unknown) => fn(db))
  }
}))

export const mockDb = vi.mocked(db, { deep: true })

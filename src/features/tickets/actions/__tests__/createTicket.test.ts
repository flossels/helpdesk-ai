import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDb } from '@/tests/mocks/db'
import { mockAgent, mockUnauthenticated } from '@/tests/mocks/auth'
import type * as NextServer from 'next/server'

// Next.js server APIs the action calls.
// `importOriginal` keeps the rest of `next/server` intact: next-auth
// imports from it too, and replacing the whole module breaks that.
vi.mock('next/server', async (importOriginal) => ({
  ...(await importOriginal<typeof NextServer>()),
  after: vi.fn()
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

vi.mock('@/features/tickets/lib/generateTrackingId', () => ({
  generateTrackingId: vi.fn(async () => 'HD-0001')
}))
vi.mock('@/features/tickets/lib/computeSlaDeadline', () => ({
  computeSlaDeadline: vi.fn(async () => null)
}))
vi.mock('@/features/tickets/lib/findOrCreateCustomer', () => ({
  findOrCreateCustomer: vi.fn(async () => ({ id: 'customer-1' }))
}))

vi.mock('@/shared/lib/logActivity', () => ({ logActivity: vi.fn() }))
vi.mock('@/shared/lib/eventBus', () => ({ publishEvent: vi.fn() }))
// The action chains `.catch()` onto these two, so their mocks have to
// return a promise rather than undefined.
vi.mock('@/shared/lib/dispatchWebhooks', () => ({
  dispatchWebhooks: vi.fn(async () => undefined)
}))
vi.mock('@/features/ai/actions/categorizeTicket', () => ({
  categorizeTicket: vi.fn()
}))
vi.mock('@/shared/lib/sendEmail', () => ({
  sendEmail: vi.fn(async () => undefined)
}))
vi.mock('@/emails/TicketCreated', () => ({ TicketCreated: vi.fn() }))

import { createTicket } from '@/features/tickets/actions/createTicket'
import { after } from 'next/server'
import { categorizeTicket } from '@/features/ai/actions/categorizeTicket'
import { dispatchWebhooks } from '@/shared/lib/dispatchWebhooks'
import { sendEmail } from '@/shared/lib/sendEmail'

const mockAfter = vi.mocked(after)

describe('createTicket', () => {
  const validInput = {
    subject: 'Cannot log in after reset',
    description: 'I reset my password but the login still fails with an error',
    categoryId: 'clx9k2m4p0001abcd1234efgh',
    email: 'customer@example.test'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockAgent()
    mockDb.ticket.create.mockResolvedValue({
      id: 'ticket-1',
      trackingId: 'HD-0001'
    } as never)
  })

  it('creates a ticket with valid input', async () => {
    const result = await createTicket(validInput)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.trackingId).toBe('HD-0001')
    }
    expect(mockDb.ticket.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          subject: validInput.subject,
          organizationId: 'org-1',
          customerId: 'customer-1',
          priority: 'MEDIUM'
        })
      })
    )
  })

  it('returns an error when unauthenticated', async () => {
    mockUnauthenticated()

    const result = await createTicket(validInput)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Not authenticated.')
    }
    expect(mockDb.ticket.create).not.toHaveBeenCalled()
  })

  it('rejects input that fails validation', async () => {
    const result = await createTicket({ ...validInput, subject: 'Hi' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.fieldErrors?.subject).toBeDefined()
    }
    expect(mockDb.ticket.create).not.toHaveBeenCalled()
  })

  it('requires the tickets:write scope', async () => {
    mockAgent(['tickets:read'])

    const result = await createTicket(validInput)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Insufficient permissions.')
    }
    expect(mockDb.ticket.create).not.toHaveBeenCalled()
  })

  it('defers categorization, analytics, webhooks and the confirmation email', async () => {
    await createTicket(validInput)

    // `after` only records the work; the response is what the caller waits
    // for. Running the recorded tasks here asserts what was scheduled.
    // It takes a callback or a promise, so we handle both shapes.
    expect(mockAfter).toHaveBeenCalledTimes(4)
    await Promise.all(mockAfter.mock.calls.map(([task]) => (typeof task === 'function' ? task() : task)))

    expect(categorizeTicket).toHaveBeenCalledWith('ticket-1', 'org-1')
    expect(dispatchWebhooks).toHaveBeenCalledWith('org-1', expect.objectContaining({ type: 'ticket.created' }))
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: validInput.email }))
  })
})

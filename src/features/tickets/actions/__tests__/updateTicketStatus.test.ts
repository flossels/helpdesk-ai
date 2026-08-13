import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDb } from '@/tests/mocks/db'
import { mockAgent } from '@/tests/mocks/auth'
import type * as NextServer from 'next/server'

vi.mock('next/server', async (importOriginal) => ({
  ...(await importOriginal<typeof NextServer>()),
  after: vi.fn()
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), updateTag: vi.fn() }))
vi.mock('@/shared/lib/logActivity', () => ({ logActivity: vi.fn() }))
vi.mock('@/shared/lib/eventBus', () => ({ publishEvent: vi.fn() }))
vi.mock('@/shared/lib/dispatchWebhooks', () => ({ dispatchWebhooks: vi.fn() }))
vi.mock('@/features/ai/actions/embedTicket', () => ({ embedTicket: vi.fn() }))
vi.mock('@/shared/lib/sendEmail', () => ({ sendEmail: vi.fn() }))

import { updateTicketStatus } from '@/features/tickets/actions/updateTicketStatus'
import { after } from 'next/server'

const mockAfter = vi.mocked(after)

describe('updateTicketStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAgent()
    mockDb.ticket.findFirst.mockResolvedValue({
      id: 'ticket-1',
      trackingId: 'HD-0001',
      subject: 'Invoice for March is missing',
      status: 'OPEN',
      email: null
    } as never)
    mockDb.ticket.update.mockResolvedValue({
      id: 'ticket-1',
      trackingId: 'HD-0001',
      subject: 'Invoice for March is missing',
      status: 'IN_PROGRESS'
    } as never)
  })

  it('rejects an invalid status', async () => {
    const result = await updateTicketStatus({ ticketId: 'ticket-1', status: 'NOPE' as never })
    expect(result.success).toBe(false)
    expect(mockDb.ticket.update).not.toHaveBeenCalled()
  })

  it('updates the ticket on the happy path', async () => {
    const result = await updateTicketStatus({ ticketId: 'ticket-1', status: 'IN_PROGRESS' })
    expect(result.success).toBe(true)
    expect(mockDb.ticket.update).toHaveBeenCalled()
  })

  it('schedules only the webhook for a non-resolving status', async () => {
    await updateTicketStatus({ ticketId: 'ticket-1', status: 'IN_PROGRESS' })
    expect(mockAfter).toHaveBeenCalledTimes(1)
  })

  it('also schedules the re-embedding when the ticket resolves', async () => {
    await updateTicketStatus({ ticketId: 'ticket-1', status: 'RESOLVED' })
    expect(mockAfter).toHaveBeenCalledTimes(2)
  })
})

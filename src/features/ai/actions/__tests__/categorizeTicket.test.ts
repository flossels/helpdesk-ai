import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDb } from '@/tests/mocks/db'
import { mockGenerateText, textResult } from '@/tests/mocks/ai'

vi.mock('@/features/ai/lib/getModel', () => ({
  getModel: vi.fn(() => 'mock-model'),
  resolveModelId: vi.fn((id: string) => id)
}))
vi.mock('@/features/ai/lib/trackUsage', () => ({ trackUsage: vi.fn() }))

import { categorizeTicket } from '@/features/ai/actions/categorizeTicket'

const categories = [
  { id: 'cat-billing', name: 'Billing', description: 'invoices' },
  { id: 'cat-tech', name: 'Technical Issue', description: 'bugs' }
]

describe('categorizeTicket', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.organization.findUnique.mockResolvedValue({
      aiModel: 'openai/gpt-5.6-terra',
      autoCategorizationEnabled: true
    } as never)
    mockDb.ticket.findFirst.mockResolvedValue({
      subject: 'Invoice missing',
      description: 'The March invoice never arrived.',
      customerId: 'user-1'
    } as never)
    mockDb.category.findMany.mockResolvedValue(categories as never)
  })

  it('does nothing when the organization has the feature off', async () => {
    mockDb.organization.findUnique.mockResolvedValue({
      aiModel: 'openai/gpt-5.6-terra',
      autoCategorizationEnabled: false
    } as never)

    await categorizeTicket('ticket-1', 'org-1')
    expect(mockGenerateText).not.toHaveBeenCalled()
  })

  it('applies a high-confidence result to the ticket', async () => {
    mockGenerateText.mockResolvedValue(
      textResult({
        category: 'Billing',
        priority: 'HIGH',
        sentiment: 'NEGATIVE',
        tags: ['invoice'],
        confidence: 0.95
      })
    )

    await categorizeTicket('ticket-1', 'org-1')

    expect(mockDb.ticket.update).toHaveBeenCalled()
    expect(mockDb.activityLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: 'ai.categorized' })
      })
    )
  })

  it('only suggests when the confidence is low', async () => {
    mockGenerateText.mockResolvedValue(
      textResult({
        category: 'Billing',
        priority: 'HIGH',
        sentiment: 'NEUTRAL',
        tags: [],
        confidence: 0.4
      })
    )

    await categorizeTicket('ticket-1', 'org-1')

    expect(mockDb.ticket.update).not.toHaveBeenCalled()
    expect(mockDb.activityLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: 'ai.categorization_suggested' })
      })
    )
  })

  it('suggests rather than applies when the model invents a category', async () => {
    mockGenerateText.mockResolvedValue(
      textResult({
        category: 'Rocket Science',
        priority: 'LOW',
        sentiment: 'NEUTRAL',
        tags: [],
        confidence: 0.99
      })
    )

    await categorizeTicket('ticket-1', 'org-1')
    expect(mockDb.ticket.update).not.toHaveBeenCalled()
  })
})

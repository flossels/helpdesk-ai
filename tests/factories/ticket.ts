import type { TicketListItem } from '@/features/tickets/types'

let counter = 0

// Generates a realistic ticket list item. Override any field per test.
export function buildTicket(overrides: Partial<TicketListItem> = {}): TicketListItem {
  counter += 1
  return {
    id: `ticket-${counter}`,
    trackingId: `HD-${String(counter).padStart(4, '0')}`,
    subject: `Test ticket ${counter}`,
    status: 'OPEN',
    priority: 'MEDIUM',
    slaDeadline: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    category: { id: 'cat-1', name: 'General', color: '#64748b' },
    assignee: null,
    customer: { id: 'customer-1', name: 'Max Test', email: 'max@test.com' },
    _count: { replies: 0 },
    ...overrides
  }
}

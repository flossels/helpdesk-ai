import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockAgent } from '@/tests/mocks/auth'
import { buildTicket } from '@/tests/factories/ticket'
import type { ReactNode } from 'react'

// One mock per module the component imports. The badges are absent here
// on purpose: what we do not name keeps running for real.
vi.mock('@/features/tickets/queries/getTickets', () => ({
  getTickets: vi.fn()
}))
vi.mock('@/features/tickets/components/BulkActionBar', () => ({
  BulkActionBar: () => null
}))
vi.mock('@/shared/components/RelativeTime', () => ({
  RelativeTime: () => null
}))
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>
}))

import { getTickets } from '@/features/tickets/queries/getTickets'
import { TicketList } from '@/features/tickets/components/TicketList'

const mockGetTickets = vi.mocked(getTickets)

describe('TicketList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAgent()
  })

  it('renders tickets from the query', async () => {
    mockGetTickets.mockResolvedValue([
      buildTicket({
        subject: 'Login issue',
        status: 'OPEN',
        priority: 'HIGH'
      })
    ])

    // Server Components are async functions: await the component to get
    // its JSX, then render that.
    const ui = await TicketList({})
    render(ui)

    expect(screen.getByText('Login issue')).toBeInTheDocument()
    expect(screen.getByText('OPEN')).toBeInTheDocument()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
  })

  it('shows an empty state when there are no tickets', async () => {
    mockGetTickets.mockResolvedValue([])

    const ui = await TicketList({})
    render(ui)

    expect(screen.getByText('No tickets found.')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TicketStatusBadge } from '@/features/tickets/components/TicketStatusBadge'

describe('TicketStatusBadge', () => {
  it('renders the status it is given', () => {
    render(<TicketStatusBadge status="OPEN" />)
    expect(screen.getByText('OPEN')).toBeInTheDocument()
  })
})

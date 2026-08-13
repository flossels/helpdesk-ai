import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TicketStatusBadge } from '@/features/tickets/components/TicketStatusBadge'

describe('TicketStatusBadge', () => {
  it('renders the status it is given', () => {
    render(<TicketStatusBadge status="OPEN" />)
    expect(screen.getByText('OPEN')).toBeInTheDocument()
  })

  it('prefers a localized label when one is passed', () => {
    render(<TicketStatusBadge status="IN_PROGRESS" label="In Bearbeitung" />)
    expect(screen.getByText('In Bearbeitung')).toBeInTheDocument()
    expect(screen.queryByText('IN PROGRESS')).not.toBeInTheDocument()
  })
})

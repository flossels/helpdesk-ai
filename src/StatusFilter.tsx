import { useOptimistic, useTransition } from 'react'
import { fetchFilteredTickets } from './lib/fetchFilteredTickets'
import type { Ticket, TicketStatus } from './types'

type FilterValue = TicketStatus | 'ALL'

type Props = {
  value: FilterValue
  tickets: Ticket[]
  onFiltered: (filter: FilterValue, results: Ticket[]) => void
}

export function StatusFilter({ value, tickets, onFiltered }: Props) {
  const [optimisticFilter, setOptimisticFilter] = useOptimistic(value)
  const [, startTransition] = useTransition()

  const handleChange = (newFilter: FilterValue) => {
    startTransition(async () => {
      setOptimisticFilter(newFilter)
      const results = await fetchFilteredTickets(newFilter, tickets)

      onFiltered(newFilter, results)
    })
  }

  return (
    <div>
      <label htmlFor="status-filter">Filter by status:{' '}</label>
      <select
        id="status-filter"
        value={optimisticFilter}
        onChange={(e) =>
          handleChange(e.target.value as FilterValue,)
        }
      >
        <option value="ALL">All</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="WAITING">Waiting</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>
    </div>
  )
}
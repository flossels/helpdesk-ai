import {
  type FilterValue,
  sampleTickets,
  type Ticket,
  type TicketPriority
} from './types.ts'
import { useEffect, useState } from 'react'
import { StatusFilter } from './StatusFilter.tsx'
import { TicketForm } from './TicketForm.tsx'
import { TicketList } from './TicketList.tsx'
import { Greeting } from './Greeting.tsx'
import { TogglePanel } from './TogglePanel.tsx'
import { Counter } from './Counter.tsx'

function App() {
  const [tickets, setTickets] = useState<Ticket[]>(sampleTickets)
  const [filter, setFilter] = useState<FilterValue>('ALL')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search),
      300,
    )
    return () => clearTimeout(timer)
  }, [search])

  const filteredTickets = tickets
    .filter((t) => filter === 'ALL' ? true : t.status === filter)
    .filter((t) =>
      t.subject
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
    )

  function handleAddTicket(newTicket: {
    subject: string
    description: string
    priority: TicketPriority
  }) {
    const ticket: Ticket = {
      ...newTicket,
      id: crypto.randomUUID(),
      trackingId: `HD-${Date.now()}`,
      status: 'OPEN',
      createdAt: new Date()
    }
    setTickets((prev) => [ticket, ...prev])
  }

  return (
    <div>
      <h1>HelpDesk AI: Ticket Board</h1>
      <Greeting
        name="Maria"
        ticketCount={tickets.filter((t) => t.status !== 'RESOLVED').length}
      />
      <input
        type="text"
        placeholder="Search tickets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <StatusFilter value={filter} onChange={setFilter} />
      <TicketForm onSubmit={handleAddTicket} />
      <h2>Tickets ({filteredTickets.length})</h2>
      <TicketList tickets={filteredTickets} />
      <TogglePanel title="Counter">
        <Counter />
      </TogglePanel>
    </div>
  )
}

export default App

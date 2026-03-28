import { useEffect, useState } from 'react'
import { StatusFilter } from './StatusFilter'
import { TicketForm } from './TicketForm'
import { TicketList } from './TicketList'
import type { Ticket, TicketStatus } from './types'
import { sampleTickets } from './types'
import { Greeting } from './Greeting'
import { TogglePanel } from './TogglePanel'
import { Counter } from './Counter'

type FilterValue = TicketStatus | 'ALL'

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
    .filter((t) => t.subject.toLowerCase().includes(debouncedSearch.toLowerCase()))

  function handleAddTicket(newTicket: Pick<Ticket, 'subject' | 'description' | 'priority'>) {
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
      <h1>HelpDesk AI — Ticket Board</h1>
      <Greeting name='Maria' ticketCount={sampleTickets.filter((t) => t.status !== 'RESOLVED').length} />
      <input
        type="text"
        placeholder="Search tickets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <StatusFilter value={filter} onChange={setFilter}/>
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
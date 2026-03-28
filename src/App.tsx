import { useState } from 'react'
import { StatusFilter } from './StatusFilter'
import { TicketForm } from './TicketForm'
import { TicketList } from './TicketList'
import type { Ticket, TicketStatus } from './types'
import { sampleTickets } from './types'
import { Greeting } from './Greeting'
import { TogglePanel } from './TogglePanel'
import { Counter } from './Counter'
import { useTicketFilters } from './hooks/useTicketFilters'
import { ThemeProvider } from './provider/ThemeProvider'
import { ThemeToggle } from './ThemeToggle'
import { ErrorBoundary } from './ErrorBoundary'

function App() {
  const [tickets, setTickets] = useState<Ticket[]>(sampleTickets)
  const filters = useTicketFilters()

  const handleFilter = (filter: TicketStatus | 'ALL', results: Ticket[]) => {
    setTickets(results)
    filters.setStatus(filter)
  }

  return (
    <ThemeProvider>
      <div>
        <h1>HelpDesk AI — Ticket Board</h1>
        <ThemeToggle />
        <Greeting name='Maria' ticketCount={sampleTickets.filter((t) => t.status !== 'RESOLVED').length} />
        <input
          type="text"
          placeholder="Search tickets…"
          value={filters.search}
          onChange={(e) => filters.setSearch(e.target.value)}
        />
        <StatusFilter value={filters.status} tickets={sampleTickets} onFiltered={handleFilter} />
        <TicketForm />
        <h2>Tickets ({tickets.length})</h2>
        <ErrorBoundary fallback={<p>Something went wrong.</p>}>
          <TicketList tickets={tickets} />
        </ErrorBoundary>
        <TogglePanel title="Counter">
          <Counter />
        </TogglePanel>
      </div>
    </ThemeProvider>
  )
}

export default App
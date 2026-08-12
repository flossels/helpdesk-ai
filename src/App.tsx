import { Suspense, useState } from 'react'
import { sampleTickets } from './types'
import type { FilterValue, Ticket } from './types'
import { useTicketFilters } from './hooks/useTicketFilters'
import { Greeting } from './Greeting'
import { StatusFilter } from './StatusFilter'
import { TicketForm } from './TicketForm'
import { TicketList } from './TicketList'
import { TogglePanel } from './TogglePanel'
import { Counter } from './Counter'
import { ThemeProvider } from './provider/ThemeProvider'
import { ErrorBoundary } from './ErrorBoundary'
import { ThemeToggle } from './ThemeToggle'

function App() {
  const [tickets, setTickets] = useState<Ticket[]>(sampleTickets)
  const [results, setResults] = useState<Ticket[]>(sampleTickets)
  const { search, setSearch, status, setStatus, debouncedSearch } = useTicketFilters()

  const visibleTickets = results.filter((t) =>
    t.subject.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  function handleFilter(filter: FilterValue, filtered: Ticket[]) {
    setResults(filtered)
    setStatus(filter)
  }

  function handleAddTicket(ticket: Ticket) {
    setTickets((prev) => [ticket, ...prev])
    setResults((prev) => [ticket, ...prev])
  }

  return (
    <ThemeProvider>
      <div>
        <h1>HelpDesk AI: Ticket Board</h1>
        <ThemeToggle />
        <Greeting name='Maria' ticketCount={tickets.filter((t) => t.status !== 'RESOLVED').length} />
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <StatusFilter value={status} tickets={tickets} onFiltered={handleFilter} />
        <TicketForm onCreated={handleAddTicket} />
        <h2>Tickets ({visibleTickets.length})</h2>
        <ErrorBoundary fallback={<p>Something went wrong.</p>}>
          <Suspense fallback={<p>Loading tickets...</p>}>
            <TicketList tickets={visibleTickets} />
          </Suspense>
        </ErrorBoundary>
        <TogglePanel title="Counter">
          <Counter />
        </TogglePanel>
      </div>
    </ThemeProvider>
  )
}

export default App

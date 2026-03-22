import TicketFilterBar from '@/features/tickets/components/TicketFilterBar'
import TicketList from '@/features/tickets/components/TicketList'
import { Suspense } from 'react'

export default async function TicketsPage({ searchParams }: PageProps<'/tickets'>) {
  const { status, search } = await searchParams

  return (
    <div>
      <h1>Tickets</h1>
      <Suspense fallback={null}>
        <TicketFilterBar />
      </Suspense>
      <p className="pt-4">
        Status: {status ?? 'All'}
        {' | '}
        Search: {search ?? 'None'}
      </p>
      <TicketList status={status?.toString()} search={search?.toString()} />
    </div>
  )
}

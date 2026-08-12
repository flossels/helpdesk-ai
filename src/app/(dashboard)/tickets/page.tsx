import { Suspense } from 'react'
import { TicketFilterBar } from '@/shared/components/TicketFilterBar'
import { TicketList } from '@/shared/components/TicketList'

export default async function TicketsPage({ searchParams }: PageProps<'/tickets'>) {
  const { status, search } = await searchParams

  return (
    <div>
      <h1>Tickets</h1>
      <Suspense fallback={null}>
        <TicketFilterBar />
      </Suspense>
      <p>
        Status: {status ?? 'All'}
        {' | '}
        Search: {search ?? 'None'}
      </p>
      <TicketList />
    </div>
  )
}

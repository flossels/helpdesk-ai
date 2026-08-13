import { Suspense } from 'react'
import { TicketEvents } from '@/features/tickets/components/TicketEvents'
import { TicketFilterBar } from '@/features/tickets/components/TicketFilterBar'
import { TicketList } from '@/features/tickets/components/TicketList'

export default async function TicketsPage({ searchParams }: PageProps<'/tickets'>) {
  const { status, search } = await searchParams

  return (
    <div className="flex flex-col gap-4">
      <TicketEvents />
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tickets</h1>
      <Suspense fallback={null}>
        <TicketFilterBar />
      </Suspense>
      <TicketList status={status?.toString()} search={search?.toString()} />
    </div>
  )
}

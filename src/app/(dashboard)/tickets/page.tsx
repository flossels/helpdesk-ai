import { Suspense } from 'react'
import { TicketFilterBar } from '@/shared/components/TicketFilterBar'
import { TicketList } from '@/shared/components/TicketList'

export default async function TicketsPage({ searchParams }: PageProps<'/tickets'>) {
  const { status, search } = await searchParams

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tickets</h1>
      <Suspense fallback={null}>
        <TicketFilterBar />
      </Suspense>
      <TicketList status={status?.toString()} search={search?.toString()} />
    </div>
  )
}

import { Suspense } from 'react'
import { cn } from '@/shared/lib/cn'
import { TicketEvents } from '@/features/tickets/components/TicketEvents'
import { TicketFilterBar } from '@/features/tickets/components/TicketFilterBar'
import { TicketList } from '@/features/tickets/components/TicketList'
import { TicketListSkeleton } from '@/features/tickets/components/TicketListSkeleton'

export const instant = true

export default function TicketsPage({ searchParams }: PageProps<'/tickets'>) {
  return (
    <div className={cn('flex flex-col gap-4')}>
      <TicketEvents />
      <h1 className={cn('text-2xl font-bold text-slate-900 dark:text-slate-100')}>Tickets</h1>
      <Suspense fallback={null}>
        <TicketFilterBar />
      </Suspense>
      <Suspense fallback={<TicketListSkeleton />}>
        <TicketList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

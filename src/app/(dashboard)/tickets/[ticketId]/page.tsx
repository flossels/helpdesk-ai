import { Suspense } from 'react'
import { getTicketById } from '@/features/tickets/queries/getTicketById'
import { SummarySkeleton } from '@/features/tickets/components/SummarySkeleton'
import { HeaderSkeleton } from '@/features/tickets/components/HeaderSkeleton'
import { ThreadSkeleton } from '@/features/tickets/components/ThreadSkeleton'
import { ThreadErrorBoundary } from '@/features/tickets/components/ThreadErrorBoundary'
import { TicketHeader } from '@/features/tickets/components/TicketHeader'
import { TicketStatusControl } from '@/features/tickets/components/TicketStatusControl'
import { TicketReplySection } from '@/features/tickets/components/TicketReplySection'
import { TicketSummary } from '@/features/tickets/components/TicketSummary'
import { TicketThread } from '@/features/tickets/components/TicketThread'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: PageProps<'/tickets/[ticketId]'>): Promise<Metadata> {
  const { ticketId } = await params
  const ticket = await getTicketById(ticketId)

  if (!ticket) return { title: 'Ticket not found' }

  return { title: ticket.subject }
}

export default function TicketPage({ params }: PageProps<'/tickets/[ticketId]'>) {
  return (
    <div className="flex flex-col gap-8 py-2">
      <Suspense fallback={<HeaderSkeleton />}>
        <TicketHeader params={params} />
      </Suspense>

      <Suspense fallback={null}>
        <TicketStatusControl params={params} />
      </Suspense>

      <ThreadErrorBoundary>
        <Suspense fallback={<ThreadSkeleton />}>
          <TicketThread params={params} />
        </Suspense>
      </ThreadErrorBoundary>

      <Suspense fallback={<SummarySkeleton />}>
        <TicketSummary />
      </Suspense>

      <Suspense fallback={null}>
        <TicketReplySection params={params} />
      </Suspense>
    </div>
  )
}

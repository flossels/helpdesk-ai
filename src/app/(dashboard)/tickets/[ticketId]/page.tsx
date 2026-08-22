import { Suspense } from 'react'
import { TicketHeader } from '@/shared/components/TicketHeader'
import { HeaderSkeleton } from '@/shared/components/HeaderSkeleton'
import { ThreadSkeleton } from '@/shared/components/ThreadSkeleton'
import { TicketThread } from '@/shared/components/TicketThread'
import { SummarySkeleton } from '@/shared/components/SummarySkeleton'
import { TicketSummary } from '@/shared/components/TicketSummary'
import { TicketReplySection } from '@/shared/components/TicketReplySection'
import { ThreadErrorBoundary } from '@/shared/components/ThreadErrorBoundary'
import { TicketStatusControl } from '@/shared/components/TicketStatusControl'
import { getTicketById } from '@/lib/placeholderData'
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

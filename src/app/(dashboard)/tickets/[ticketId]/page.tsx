import { Suspense } from 'react'
import { TicketHeader } from '@/shared/components/TicketHeader'
import { HeaderSkeleton } from '@/shared/components/HeaderSkeleton'
import { ThreadSkeleton } from '@/shared/components/ThreadSkeleton'
import { TicketThread } from '@/shared/components/TicketThread'
import { SummarySkeleton } from '@/shared/components/SummarySkeleton'
import { TicketSummary } from '@/shared/components/TicketSummary'
import { TicketReplySection } from '@/shared/components/TicketReplySection'
import { ThreadErrorBoundary } from '@/shared/components/ThreadErrorBoundary'

export default function TicketPage({ params }: PageProps<'/tickets/[ticketId]'>) {
  return (
    <div className="flex flex-col gap-8 py-2">
      <Suspense fallback={<HeaderSkeleton />}>
        <TicketHeader params={params} />
      </Suspense>

      <ThreadErrorBoundary>
        <Suspense fallback={<ThreadSkeleton />}>
          <TicketThread />
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

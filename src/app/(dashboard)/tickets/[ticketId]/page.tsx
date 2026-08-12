import { Suspense } from 'react'
import { TicketHeader } from '@/shared/components/TicketHeader'
import { HeaderSkeleton, ThreadSkeleton } from '@/shared/components/TicketSkeleton'
import { ThreadErrorBoundary } from '@/shared/components/ThreadErrorBoundary'
import { TicketThread } from '@/shared/components/TicketThread'
import { SummarySkeleton } from '@/shared/components/SummarySkeleton'
import { TicketSummary } from '@/shared/components/TicketSummary'
import { TicketReplySection } from '@/shared/components/TicketReplySection'

export default function TicketPage({ params }: PageProps<'/tickets/[ticketId]'>) {
  return (
    <div className="flex flex-col space-y-4 divide-y">
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

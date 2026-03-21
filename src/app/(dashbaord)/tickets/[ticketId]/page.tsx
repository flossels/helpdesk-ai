import SummarySkeleton from '@/features/tickets/components/skeletons/SummarySkeleton'
import ThreadSkeleton from '@/features/tickets/components/skeletons/ThreadSkeleton'
import TicketHeader from '@/features/tickets/components/TicketHeader'
import TicketReplyForm from '@/features/tickets/components/TicketReplyForm'
import TicketSummary from '@/features/tickets/components/TicketSummary'
import TicketThread from '@/features/tickets/components/TicketThread'
import { Suspense } from 'react'

export default async function TicketPage({ params }: PageProps<'/tickets/[ticketId]'>) {
  const { ticketId } = await params

  return (
    <div className="flex flex-col space-y-4 divide-y">
      <TicketHeader ticketId={ticketId} />

      <Suspense fallback={<ThreadSkeleton />}>
        <TicketThread />
      </Suspense>

      <Suspense fallback={<SummarySkeleton />}>
        <TicketSummary />
      </Suspense>

      <TicketReplyForm ticketId={ticketId} />
    </div>
  )
}

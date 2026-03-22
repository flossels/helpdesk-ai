import SummarySkeleton from '@/features/tickets/components/skeletons/SummarySkeleton'
import ThreadSkeleton from '@/features/tickets/components/skeletons/ThreadSkeleton'
import TicketHeader from '@/features/tickets/components/TicketHeader'
import TicketReplyForm from '@/features/tickets/components/TicketReplyForm'
import TicketSummary from '@/features/tickets/components/TicketSummary'
import TicketThread from '@/features/tickets/components/TicketThread'
import { Suspense } from 'react'
import { getTicketById } from '@/lib/placeholderData'
import { notFound } from 'next/navigation'
import TicketStatusSelect from '@/features/tickets/components/TicketStatusSelect'

export async function generateMetadata({ params }: PageProps<'/tickets/[ticketId]'>) {
  const { ticketId } = await params
  const ticket = await getTicketById(ticketId)

  if (!ticket) return { title: 'Ticket not found' }

  return { title: ticket.subject }
}

export default async function TicketPage({ params }: PageProps<'/tickets/[ticketId]'>) {
  const { ticketId } = await params
  const ticket = await getTicketById(ticketId)
  if (!ticket) notFound()

  return (
    <div className="flex flex-col space-y-4 divide-y">
      <TicketHeader ticketId={ticketId} />
      <TicketStatusSelect ticketId={ticketId} status={ticket.status} />

      <Suspense fallback={<ThreadSkeleton />}>
        <TicketThread ticketId={ticketId} />
      </Suspense>

      <Suspense fallback={<SummarySkeleton />}>
        <TicketSummary />
      </Suspense>

      <TicketReplyForm ticketId={ticketId} />
    </div>
  )
}

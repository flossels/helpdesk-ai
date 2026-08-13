import { Suspense } from 'react'
import { forbidden, notFound } from 'next/navigation'
import { AttachmentList } from '@/shared/components/ui/AttachmentList'
import { getAttachments } from '@/features/tickets/queries/getAttachments'
import { getTicketById } from '@/features/tickets/queries/getTicketById'
import { SummarySkeleton } from '@/features/tickets/components/SummarySkeleton'
import { HeaderSkeleton } from '@/features/tickets/components/HeaderSkeleton'
import { ThreadSkeleton } from '@/features/tickets/components/ThreadSkeleton'
import { ThreadErrorBoundary } from '@/features/tickets/components/ThreadErrorBoundary'
import { TicketHeader } from '@/features/tickets/components/TicketHeader'
import { TicketReplyForm } from '@/features/tickets/components/TicketReplyForm'
import { TicketStatusSelect } from '@/features/tickets/components/TicketStatusSelect'
import { TicketSummary } from '@/features/tickets/components/TicketSummary'
import { TicketThread } from '@/features/tickets/components/TicketThread'
import { getCannedResponses } from '@/features/settings/queries/getCannedResponses'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { Metadata } from 'next'
import type { TicketStatus } from '@/shared/types/ticket'

export async function generateMetadata({ params }: PageProps<'/tickets/[ticketId]'>): Promise<Metadata> {
  const { ticketId } = await params
  const user = await getCurrentUser()
  if (!user?.organizationId) return { title: 'Ticket not found' }

  const ticket = await getTicketById(ticketId, user.organizationId)

  if (!ticket) return { title: 'Ticket not found' }

  return { title: ticket.subject }
}
export default function TicketPage({ params }: PageProps<'/tickets/[ticketId]'>) {
  return (
    <Suspense fallback={null}>
      <TicketPageContent params={params} />
    </Suspense>
  )
}

async function TicketPageContent({ params }: { params: PageProps<'/tickets/[ticketId]'>['params'] }) {
  const { ticketId } = await params
  const user = await getCurrentUser()
  if (!user?.organizationId) forbidden()

  const ticket = await getTicketById(ticketId, user.organizationId)
  if (!ticket) notFound()

  const cannedResponses = await getCannedResponses(user.organizationId)
  const attachments = await getAttachments('ticket', ticketId, user.organizationId)

  return (
    <div className="flex flex-col gap-8 py-2">
      <Suspense fallback={<HeaderSkeleton />}>
        <TicketHeader ticketId={ticketId} />
      </Suspense>
      <TicketStatusSelect key={ticket.status} ticketId={ticketId} status={ticket.status as TicketStatus} />

      {attachments.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Attachments</h2>
          <AttachmentList attachments={attachments} />
        </section>
      )}

      <ThreadErrorBoundary>
        <Suspense fallback={<ThreadSkeleton />}>
          <TicketThread ticketId={ticketId} />
        </Suspense>
      </ThreadErrorBoundary>

      <Suspense fallback={<SummarySkeleton />}>
        <TicketSummary />
      </Suspense>

      <TicketReplyForm ticketId={ticketId} cannedResponses={cannedResponses} />
    </div>
  )
}

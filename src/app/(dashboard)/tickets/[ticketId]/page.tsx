import { Suspense } from 'react'
import { forbidden, notFound } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { HeaderSkeleton } from '@/features/tickets/components/HeaderSkeleton'
import { ThreadErrorBoundary } from '@/features/tickets/components/ThreadErrorBoundary'
import { ThreadSkeleton } from '@/features/tickets/components/ThreadSkeleton'
import { TicketAttachments } from '@/features/tickets/components/TicketAttachments'
import { TicketHeader } from '@/features/tickets/components/TicketHeader'
import { TicketReplySection } from '@/features/tickets/components/TicketReplySection'
import { TicketStatusControl } from '@/features/tickets/components/TicketStatusControl'
import { TicketThread } from '@/features/tickets/components/TicketThread'
import { getTicketById } from '@/features/tickets/queries/getTicketById'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { TicketAiPanel } from '@/features/ai/components/TicketAiPanel'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: PageProps<'/tickets/[ticketId]'>): Promise<Metadata> {
  const { ticketId } = await params
  const user = await getCurrentUser()
  if (!user?.organizationId) forbidden()

  const ticket = await getTicketById(ticketId, user.organizationId)
  if (!ticket) notFound()

  return { title: ticket.subject }
}

export default function TicketPage({ params }: PageProps<'/tickets/[ticketId]'>) {
  return (
    <div className={cn('flex flex-col gap-8 py-2')}>
      <Suspense fallback={<HeaderSkeleton />}>
        <TicketHeader params={params} />
      </Suspense>

      <Suspense fallback={null}>
        <TicketStatusControl params={params} />
      </Suspense>

      <Suspense fallback={null}>
        <TicketAttachments params={params} />
      </Suspense>

      <ThreadErrorBoundary>
        <Suspense fallback={<ThreadSkeleton />}>
          <TicketThread params={params} />
        </Suspense>
      </ThreadErrorBoundary>

      <Suspense fallback={null}>
        <TicketAiPanel params={params} />
      </Suspense>

      <Suspense fallback={null}>
        <TicketReplySection params={params} />
      </Suspense>
    </div>
  )
}

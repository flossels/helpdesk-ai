import { Suspense } from 'react'
import { CustomerTicketDetail } from '@/features/tickets/components/CustomerTicketDetail'
import { ThreadSkeleton } from '@/features/tickets/components/ThreadSkeleton'

export default function PortalTicketPage({ params }: PageProps<'/[locale]/portal/[ticketId]'>) {
  return (
    <Suspense fallback={<ThreadSkeleton />}>
      <CustomerTicketDetail params={params} />
    </Suspense>
  )
}

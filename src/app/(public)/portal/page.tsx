import { Suspense } from 'react'
import Link from 'next/link'
import { unauthorized } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getCustomerTickets } from '@/features/tickets/queries/getCustomerTickets'
import { CustomerTicketList } from '@/features/tickets/components/CustomerTicketList'
import { TicketListSkeleton } from '@/features/tickets/components/TicketListSkeleton'

export default function PortalPage() {
  return (
    <div className={cn('space-y-6')}>
      <div className={cn('flex items-center justify-between')}>
        <h1>My Tickets</h1>
        <Link href="/submit" className={cn('rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700')}>
          New ticket
        </Link>
      </div>
      <Suspense fallback={<TicketListSkeleton />}>
        <PortalTickets />
      </Suspense>
    </div>
  )
}

async function PortalTickets() {
  const user = await getCurrentUser()
  if (!user) unauthorized()

  const tickets = await getCustomerTickets(user.id)

  return <CustomerTicketList tickets={tickets} />
}

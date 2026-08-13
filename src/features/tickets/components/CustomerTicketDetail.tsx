import { notFound, unauthorized } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/shared/lib/cn'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { CustomerReplyForm } from '@/features/tickets/components/CustomerReplyForm'
import { getCustomerTicket } from '@/features/tickets/queries/getCustomerTicket'
import { TicketMessageList } from '@/features/tickets/components/TicketMessageList'
import { TicketStatusBadge } from '@/features/tickets/components/TicketStatusBadge'

type Props = {
  params: Promise<{ ticketId: string }>
}

export async function CustomerTicketDetail({ params }: Props) {
  const user = await getCurrentUser()
  if (!user) unauthorized()

  const { ticketId } = await params
  const ticket = await getCustomerTicket(ticketId, user.id)
  if (!ticket) notFound()

  return (
    <div className={cn('space-y-6')}>
      <Link href="/portal" className={cn('text-sm text-blue-600 hover:underline')}>
        Back to my tickets
      </Link>
      <div className={cn('flex items-center gap-3')}>
        <TicketStatusBadge status={ticket.status} />
        <h1 className={cn('text-xl font-semibold')}>{ticket.subject}</h1>
        <span className={cn('text-sm text-slate-500')}>{ticket.trackingId}</span>
      </div>
      <TicketMessageList messages={ticket.messages} />
      <CustomerReplyForm ticketId={ticket.id} />
    </div>
  )
}

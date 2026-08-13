import { forbidden, notFound } from 'next/navigation'
import { TicketPriorityBadge } from '@/features/tickets/components/TicketPriorityBadge'
import { getTicketById } from '@/features/tickets/queries/getTicketById'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'

type Props = {
  ticketId: string
}

export async function TicketHeader({ ticketId }: Props) {
  const user = await getCurrentUser()
  if (!user?.organizationId) forbidden()

  const ticket = await getTicketById(ticketId, user.organizationId)
  if (!ticket) notFound()

  return (
    <header>
      <h1>{ticket.subject}</h1>
      <dl className="my-6 grid grid-cols-1 gap-x-6 gap-y-3">
        <dt className="col-end-1">Priority:</dt>
        <dd>
          <TicketPriorityBadge priority={ticket.priority} />
        </dd>
      </dl>
    </header>
  )
}

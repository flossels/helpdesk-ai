import { notFound } from 'next/navigation'
import { TicketPriorityBadge } from '@/shared/components/ui/TicketPriorityBadge'
import { getTicketById } from '@/lib/placeholderData'

type Props = Pick<PageProps<'/tickets/[ticketId]'>, 'params'>

export async function TicketHeader({ params }: Props) {
  const { ticketId } = await params
  const ticket = await getTicketById(ticketId)
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

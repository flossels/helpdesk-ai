import { notFound } from 'next/navigation'
import { getTicketById } from '@/features/tickets/queries/getTicketById'
import { TicketStatusSelect } from '@/features/tickets/components/TicketStatusSelect'

type Props = Pick<PageProps<'/tickets/[ticketId]'>, 'params'>

export async function TicketStatusControl({ params }: Props) {
  const { ticketId } = await params
  const ticket = await getTicketById(ticketId)
  if (!ticket) notFound()

  return <TicketStatusSelect key={ticket.status} ticketId={ticketId} status={ticket.status} />
}

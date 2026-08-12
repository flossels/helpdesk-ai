import { TicketReplyForm } from '@/shared/components/TicketReplyForm'

type Props = Pick<PageProps<'/tickets/[ticketId]'>, 'params'>

export async function TicketReplySection({ params }: Props) {
  const { ticketId } = await params

  return <TicketReplyForm ticketId={ticketId} />
}

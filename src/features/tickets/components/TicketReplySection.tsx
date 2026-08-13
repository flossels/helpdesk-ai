import { forbidden, notFound } from 'next/navigation'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getTicketById } from '@/features/tickets/queries/getTicketById'
import { getCannedResponses } from '@/features/settings/queries/getCannedResponses'
import { TicketReplyForm } from '@/features/tickets/components/TicketReplyForm'

type Props = {
  params: Promise<{ ticketId: string }>
}

export async function TicketReplySection({ params }: Props) {
  const { ticketId } = await params
  const user = await getCurrentUser()
  if (!user?.organizationId) forbidden()

  const ticket = await getTicketById(ticketId, user.organizationId)
  if (!ticket) notFound()

  const cannedResponses = await getCannedResponses(user.organizationId)

  return <TicketReplyForm ticketId={ticketId} cannedResponses={cannedResponses} />
}

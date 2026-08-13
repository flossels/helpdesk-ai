import { forbidden, notFound } from 'next/navigation'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getTicketById } from '@/features/tickets/queries/getTicketById'
import { TicketStatusSelect } from '@/features/tickets/components/TicketStatusSelect'
import type { TicketStatus } from '@/shared/types/ticket'

type Props = {
  params: Promise<{ ticketId: string }>
}

export async function TicketStatusControl({ params }: Props) {
  const { ticketId } = await params
  const user = await getCurrentUser()
  if (!user?.organizationId) forbidden()

  const ticket = await getTicketById(ticketId, user.organizationId)
  if (!ticket) notFound()

  return <TicketStatusSelect key={ticket.status} ticketId={ticketId} status={ticket.status as TicketStatus} />
}

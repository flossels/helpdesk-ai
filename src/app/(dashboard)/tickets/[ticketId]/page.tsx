import { notFound } from 'next/navigation'

export default async function TicketPage({ params }: PageProps<'/tickets/[ticketId]'>) {
  const { ticketId } = await params
  const ticket = null

  if (!ticket) notFound()

  return <h1>{ticketId}</h1>
}

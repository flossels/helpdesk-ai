// import { notFound } from 'next/navigation'

export default async function TicketPage({ params }: PageProps<'/tickets/[ticketId]'>) {
  const { ticketId } = await params
  // In Chapter 8, this will be a real database query
  // const ticket = null // placeholder

  // if (!ticket) notFound()

  return <h1>{ticketId}</h1>
}

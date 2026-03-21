import Modal from '@/shared/components/ui/Modal'

export default async function TicketPreview({ params }: PageProps<'/tickets/[ticketId]'>) {
  const { ticketId } = await params

  return (
    <Modal>
      <h2>Ticket Preview: {ticketId}</h2>
      <p>Quick summary of the ticket. Click through for the full view.</p>
    </Modal>
  )
}

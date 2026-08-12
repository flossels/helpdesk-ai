import Link from 'next/link'

export default function TicketNotFound() {
  return (
    <div>
      <h2>Ticket Not Found</h2>
      <p>This ticket does not exist or has been deleted.</p>
      <Link href="/tickets">Back to Inbox</Link>
    </div>
  )
}

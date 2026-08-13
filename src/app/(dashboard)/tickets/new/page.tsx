import { Suspense } from 'react'
import { NewTicketSection } from '@/features/tickets/components/NewTicketSection'

export default function NewTicketPage() {
  return (
    <div>
      <h1>New Ticket</h1>
      <p>Log a ticket on behalf of a customer.</p>
      <Suspense fallback={null}>
        <NewTicketSection />
      </Suspense>
    </div>
  )
}

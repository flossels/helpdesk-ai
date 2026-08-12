import { CreateTicketForm } from '@/shared/components/CreateTicketForm'

export default function SubmitPage() {
  return (
    <div>
      <h1>Submit a Ticket</h1>
      <p>Describe your issue and we will get back to you.</p>
      <CreateTicketForm />
    </div>
  )
}

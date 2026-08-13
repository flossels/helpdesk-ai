import { CreateTicketForm } from '@/features/tickets/components/CreateTicketForm'
import { getCategories } from '@/features/tickets/queries/getCategories'

export default async function SubmitPage() {
  const categories = await getCategories()

  return (
    <div>
      <h1>Submit a Ticket</h1>
      <p>Describe your issue and we will get back to you.</p>
      <CreateTicketForm categories={categories} />
    </div>
  )
}

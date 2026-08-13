import { Suspense } from 'react'
import { forbidden } from 'next/navigation'
import { CreateTicketForm } from '@/features/tickets/components/CreateTicketForm'
import { getCategories } from '@/features/tickets/queries/getCategories'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'

export default function NewTicketPage() {
  return (
    <div>
      <h1>New Ticket</h1>
      <p>Log a ticket on behalf of a customer.</p>
      <Suspense fallback={null}>
        <NewTicketForm />
      </Suspense>
    </div>
  )
}

async function NewTicketForm() {
  const user = await getCurrentUser()
  if (!user?.organizationId) forbidden()

  const categories = await getCategories(user.organizationId)

  return <CreateTicketForm categories={categories} />
}

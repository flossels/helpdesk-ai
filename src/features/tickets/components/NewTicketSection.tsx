import { forbidden } from 'next/navigation'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getCategories } from '@/features/tickets/queries/getCategories'
import { CreateTicketForm } from '@/features/tickets/components/CreateTicketForm'

export async function NewTicketSection() {
  const user = await getCurrentUser()
  if (!user?.organizationId) forbidden()

  const categories = await getCategories(user.organizationId)

  return <CreateTicketForm categories={categories} />
}

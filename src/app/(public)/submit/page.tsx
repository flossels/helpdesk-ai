import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { PublicTicketForm } from '@/features/tickets/components/PublicTicketForm'
import { getCategories } from '@/features/tickets/queries/getCategories'
import { getPublicOrganizationId } from '@/features/tickets/queries/getPublicOrganizationId'

export default function SubmitPage() {
  return (
    <div>
      <h1>Submit a Ticket</h1>
      <p>Describe your issue and we will get back to you.</p>
      <Suspense fallback={<p>Loading the form...</p>}>
        <SubmitForm />
      </Suspense>
    </div>
  )
}

async function SubmitForm() {
  const organizationId = await getPublicOrganizationId()
  if (!organizationId) notFound()

  const categories = await getCategories(organizationId)

  return <PublicTicketForm categories={categories} />
}

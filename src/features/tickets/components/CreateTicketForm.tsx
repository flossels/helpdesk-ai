'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { createTicketAction } from '@/app/(dashboard)/actions/createTicket'
import SubmitButton from '@/shared/components/SubmitButton'

const CreateTicketForm = () => {
  const router = useRouter()
  const [state, formAction] = useActionState(
    async (prev: Awaited<ReturnType<typeof createTicketAction>> | null, formData: FormData) => {
      const result = await createTicketAction(prev, formData)

      if (result.success) router.push(`/tickets/${result.data.ticketId}`)

      return result
    },
    null
  )

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="subject">Subject</label>
        <input id="subject" name="subject" required />
        {state?.fieldErrors?.subject && <p>{state.fieldErrors.subject[0]}</p>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={4} required />
        {state?.fieldErrors?.description && <p>{state.fieldErrors.description[0]}</p>}
      </div>

      <input type="hidden" name="categoryId" value="cat-1" />

      <SubmitButton label="Create Ticket" pendingLabel="Creating..." />
    </form>
  )
}

export default CreateTicketForm

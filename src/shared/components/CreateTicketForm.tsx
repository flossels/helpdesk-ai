'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { SubmitButton } from '@/shared/components/SubmitButton'
import { createTicketAction } from '@/app/(dashboard)/actions/createTicket'

export function CreateTicketForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(
    async (prev: Awaited<ReturnType<typeof createTicketAction>> | null, formData: FormData) => {
      const result = await createTicketAction(prev, formData)

      if (result.success) router.push(`/track/${result.data.trackingId}`)

      return result
    },
    null
  )

  const errors = state?.success === false ? state.fieldErrors : undefined

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="subject">Subject</label>
        <input id="subject" name="subject" required />
        {errors?.subject && <p>{errors.subject[0]}</p>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={4} required />
        {errors?.description && <p>{errors.description[0]}</p>}
      </div>

      <input type="hidden" name="categoryId" value="cat-1" />

      <SubmitButton label="Create Ticket" pendingLabel="Creating..." />
    </form>
  )
}

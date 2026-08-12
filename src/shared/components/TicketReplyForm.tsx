'use client'

import { useActionState, useRef } from 'react'
import { SubmitButton } from '@/shared/components/SubmitButton'
import { replyToTicketAction } from '@/app/(dashboard)/actions/replyToTicket'

type Props = {
  ticketId: string
}

export function TicketReplyForm({ ticketId }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(
    async (prev: Awaited<ReturnType<typeof replyToTicketAction>> | null, formData: FormData) => {
      const result = await replyToTicketAction(prev, formData)

      if (result.success) formRef.current?.reset()

      return result
    },
    null
  )

  const errors = state?.success === false ? state.fieldErrors : undefined

  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="ticketId" value={ticketId} />
      <label htmlFor="reply-input">Your reply</label>
      <textarea id="reply-input" name="content" rows={4} required />
      {errors?.content && <p>{errors.content[0]}</p>}

      <SubmitButton label="Send Reply" pendingLabel="Sending..." />
    </form>
  )
}

'use client'

import { replyToTicketAction } from '@/app/(dashboard)/actions/replyToTickets'
import SubmitButton from '@/shared/components/SubmitButton'
import { useActionState, useRef } from 'react'

type Props = {
  ticketId: string
}

const TicketReplyForm = ({ ticketId }: Props) => {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(
    async (prev: Awaited<ReturnType<typeof replyToTicketAction>> | null, formData: FormData) => {
      const result = await replyToTicketAction(prev, formData)

      if (result.success) formRef.current?.reset()

      return result
    },
    null
  )

  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="ticketId" value={ticketId} />
      <label htmlFor="reply-input">Your reply</label>
      <textarea id="reply-input" name="content" rows={4} required />
      {state && !state.success && <p>{state.error}</p>}

      <SubmitButton label="Send Reply" pendingLabel="Sending..." />
    </form>
  )
}

export default TicketReplyForm

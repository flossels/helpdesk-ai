import { useActionState, useRef } from 'react'
import { submitTicket } from './lib/submitTicket'
import type { FormState } from './lib/submitTicket'
import type { Ticket } from './types'
import { SubmitButton } from './SubmitButton'

type Props = {
  onCreated: (ticket: Ticket) => void
}

export function TicketForm({ onCreated }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState<FormState, FormData>(
    async (prevState, formData) => {
      const result = await submitTicket(prevState, formData)
      if (result?.ticket) {
        onCreated(result.ticket)
        formRef.current?.reset()
      }

      return result
    },
    null
  )

  return (
    <form ref={formRef} action={formAction}>
      <div>
        <label htmlFor="subject">Subject</label>
        <input id="subject" name="subject" type="text" />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" />
      </div>
      <div>
        <label htmlFor="priority">Priority</label>
        <select id="priority" name="priority" defaultValue="MEDIUM">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {state && <p>{state.message}</p>}

      <SubmitButton label="Add Ticket" />
    </form>
  )
}
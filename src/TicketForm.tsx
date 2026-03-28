import { useActionState, useRef } from 'react'
import { submitTicket, type FormState } from './lib/submitTicket'
import { SubmitButton } from './SubmitButton'

export function TicketForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState<FormState, FormData>(
    async (prevState, formData) => {
      const result = await submitTicket(prevState, formData)
      if (result?.success) formRef.current?.reset()

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
        <select id="priority" name="priority">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {state && !state.success && <p role="alert">{state.message}</p>}
      {state?.success && <p>{state.message}</p>}

      <SubmitButton label="Add Ticket" />
    </form>
  )
}
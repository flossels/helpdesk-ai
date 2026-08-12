'use client'

import { useActionState, useOptimistic, useRef } from 'react'
import { TICKET_STATUSES } from '@/shared/types/ticket'
import { updateTicketStatusAction } from '@/app/(dashboard)/actions/updateTicketStatus'
import type { ChangeEventHandler } from 'react'

type Props = {
  ticketId: string
  status: string
}

export function TicketStatusSelect({ ticketId, status }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status)

  const [, formAction, isPending] = useActionState(
    async (prev: Awaited<ReturnType<typeof updateTicketStatusAction>> | null, formData: FormData) => {
      setOptimisticStatus(formData.get('status') as string)
      return updateTicketStatusAction(prev, formData)
    },
    null
  )

  const onChange: ChangeEventHandler<HTMLSelectElement> = () => {
    formRef.current?.requestSubmit()
  }

  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="ticketId" value={ticketId} />
      <label htmlFor="ticket-status">Status</label>
      <select id="ticket-status" name="status" disabled={isPending} value={optimisticStatus} onChange={onChange}>
        {TICKET_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </form>
  )
}

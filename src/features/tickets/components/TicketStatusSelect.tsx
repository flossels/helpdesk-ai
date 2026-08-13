'use client'

import { useOptimistic, useRef } from 'react'
import { useActionState } from 'react'
import { TICKET_STATUSES } from '@/shared/types/ticket'
import { cn } from '@/shared/lib/cn'
import { updateTicketStatusAction } from '@/features/tickets/actions/updateTicketStatus'
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
      <label htmlFor="ticket-status" className={cn('mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300')}>
        Status
      </label>
      <select
        id="ticket-status"
        name="status"
        disabled={isPending}
        value={optimisticStatus}
        onChange={onChange}
        className={cn(
          'rounded-lg border px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
        )}
      >
        {TICKET_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </form>
  )
}

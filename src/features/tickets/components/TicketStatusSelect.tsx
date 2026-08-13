'use client'

import { useOptimistic, useTransition } from 'react'
import { Field, Label } from '@headlessui/react'
import { TICKET_STATUSES } from '@/shared/types/ticket'
import { cn } from '@/shared/lib/cn'
import { Select } from '@/shared/components/ui/Select'
import { updateTicketStatus } from '@/features/tickets/actions/updateTicketStatus'
import type { TicketStatus } from '@/shared/types/ticket'

type Props = {
  ticketId: string
  status: TicketStatus
}

const STATUS_OPTIONS: TicketStatus[] = [...TICKET_STATUSES]

export function TicketStatusSelect({ ticketId, status }: Props) {
  const [isPending, startTransition] = useTransition()
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status)

  function changeStatus(next: TicketStatus) {
    startTransition(async () => {
      setOptimisticStatus(next)

      await updateTicketStatus({ ticketId, status: next })
    })
  }

  return (
    <Field>
      <Label className={cn('mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300')}>Status</Label>
      <Select
        items={STATUS_OPTIONS}
        value={optimisticStatus}
        onChange={changeStatus}
        displayValue={(s) => s}
        disabled={isPending}
      />
    </Field>
  )
}

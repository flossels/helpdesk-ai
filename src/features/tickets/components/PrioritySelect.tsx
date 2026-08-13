'use client'

import { useController, useFormContext } from 'react-hook-form'
import { Select } from '@/shared/components/ui/Select'
import { cn } from '@/shared/lib/cn'
import { TICKET_PRIORITIES } from '@/shared/types/ticket'
import type { CreateTicketInput } from '@/features/tickets/schemas'
import type { TicketPriority } from '@/shared/types/ticket'

export function PrioritySelect() {
  const { control } = useFormContext<CreateTicketInput>()
  const { field, fieldState } = useController({ name: 'priority', control })

  return (
    <>
      <Select<TicketPriority>
        items={[...TICKET_PRIORITIES]}
        value={field.value ?? 'MEDIUM'}
        onChange={field.onChange}
        displayValue={(priority) => priority}
      />
      {fieldState.error && <p className={cn('mt-1 text-sm text-rose-600')}>{fieldState.error.message}</p>}
    </>
  )
}

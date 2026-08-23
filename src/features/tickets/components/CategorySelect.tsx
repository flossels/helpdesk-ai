'use client'

import { useController, useFormContext } from 'react-hook-form'
import { SearchableSelect } from '@/shared/components/ui/SearchableSelect'
import { cn } from '@/shared/lib/cn'
import type { CreateTicketInput } from '@/features/tickets/schemas'

type Props = {
  categories: Array<{
    id: string
    name: string
  }>
}

export function CategorySelect({ categories }: Props) {
  const { control } = useFormContext<CreateTicketInput>()
  const { field, fieldState } = useController({ name: 'categoryId', control })

  return (
    <>
      <SearchableSelect
        items={categories}
        value={categories.find((c) => c.id === field.value)}
        onChange={(v) => field.onChange(v?.id ?? '')}
        displayValue={(c) => c.name}
        placeholder="Select a category"
      />
      {fieldState.error && <p className={cn('mt-1 text-sm text-rose-600')}>{fieldState.error.message}</p>}
    </>
  )
}

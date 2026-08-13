'use client'

import { useState, useTransition } from 'react'
import { Field, Input, Label } from '@headlessui/react'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/lib/cn'
import { bulkUpdateStatusAction } from '@/features/tickets/actions/bulkUpdateStatus'

type Props = {
  ticketIds: string[]
}

export function BulkActionBar({ ticketIds }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  const allSelected = selected.size === ticketIds.length && ticketIds.length > 0

  const toggleAll = () => {
    if (allSelected) return setSelected(new Set())

    setSelected(new Set(ticketIds))
  }

  const toggleOne = (id: string) => {
    const next = new Set(selected)

    if (next.has(id)) {
      next.delete(id)

      return setSelected(next)
    }

    next.add(id)

    setSelected(next)
  }

  function handleBulkResolve() {
    startTransition(async () => {
      const result = await bulkUpdateStatusAction({
        ticketIds: [...selected],
        status: 'RESOLVED'
      })

      if (result.success) setSelected(new Set())
    })
  }

  return (
    <div className={cn('space-y-2')}>
      <Field className={cn('flex items-center justify-between gap-3')}>
        <Label className={cn('flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300')}>
          <Input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className={cn('size-4 rounded border-slate-300 text-blue-600')}
          />
          Select all
        </Label>

        {selected.size > 0 && (
          <div className={cn('flex items-center gap-3')}>
            <span className={cn('text-sm text-slate-500')}>{selected.size} selected</span>
            <Button size="sm" onClick={handleBulkResolve} isLoading={isPending}>
              {isPending ? 'Updating...' : 'Mark as Resolved'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
              Cancel
            </Button>
          </div>
        )}
      </Field>

      <ul className={cn('flex flex-wrap gap-x-4 gap-y-1')}>
        {ticketIds.map((id) => (
          <li key={id}>
            <Field>
              <Label className={cn('flex items-center gap-1 text-xs text-slate-500')}>
                <Input
                  type="checkbox"
                  checked={selected.has(id)}
                  onChange={() => toggleOne(id)}
                  className={cn('size-3 rounded border-slate-300 text-blue-600')}
                />
                {id}
              </Label>
            </Field>
          </li>
        ))}
      </ul>
    </div>
  )
}

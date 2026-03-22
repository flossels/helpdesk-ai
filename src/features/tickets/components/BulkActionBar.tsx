'use client'

import { useState, useTransition } from 'react'
import { bulkUpdateStatus } from '@/app/(dashboard)/actions/bulkUpdateStatus'
import { TicketStatus } from '@/lib/placeholderData'
import Button from '@/shared/components/ui/Button'

type Props = {
  ticketIds: string[]
}

const BulkActionBar = ({ ticketIds }: Props) => {
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

  const handleBulkResolve = () => {
    startTransition(async () => {
      const result = await bulkUpdateStatus({
        ticketIds: [...selected],
        status: TicketStatus.Resolved
      })

      if (result.success) setSelected(new Set())
    })
  }

  return (
    <div>
      <label>
        <input type="checkbox" checked={allSelected} onChange={toggleAll} />
        Select all
      </label>

      <ul>
        {ticketIds.map((id) => (
          <li key={id}>
            <input type="checkbox" checked={selected.has(id)} onChange={() => toggleOne(id)} />
            {id}
          </li>
        ))}
      </ul>

      {selected.size > 0 && (
        <div>
          <span>{selected.size} selected</span>
          <Button onClick={handleBulkResolve} isLoading={isPending}>
            {isPending ? 'Updating...' : 'Mark as Resolved'}
          </Button>
          <Button variant="ghost" onClick={() => setSelected(new Set())}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}

export default BulkActionBar

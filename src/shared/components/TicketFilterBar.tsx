'use client'

import { useSearchParams } from 'next/navigation'
import { useUpdateSearchParams } from '@/shared/hooks/useUpdateSearchParams'

const STATUSES = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED']

export function TicketFilterBar() {
  const searchParams = useSearchParams()
  const updateParams = useUpdateSearchParams()

  const status = searchParams.get('status') ?? 'ALL'
  const search = searchParams.get('search') ?? ''

  return (
    <div className="my-2 flex gap-4 border-y py-2">
      <select
        value={status}
        onChange={(e) =>
          updateParams({
            status: e.target.value === 'ALL' ? null : e.target.value
          })
        }
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <input
        type="search"
        placeholder="Search tickets..."
        defaultValue={search}
        onChange={(e) => updateParams({ search: e.target.value || null })}
      />
    </div>
  )
}

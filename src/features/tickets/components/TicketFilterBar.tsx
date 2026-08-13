'use client'

import { useSearchParams } from 'next/navigation'
import { useUpdateSearchParams } from '@/shared/hooks/useUpdateSearchParams'
import { SearchableSelect } from '@/shared/components/ui/SearchableSelect'
import { cn } from '@/shared/lib/cn'
import { TICKET_STATUSES } from '@/shared/types/ticket'
import type { TicketStatus } from '@/shared/types/ticket'

const STATUSES: Array<TicketStatus | 'ALL'> = ['ALL', ...TICKET_STATUSES]

export function TicketFilterBar() {
  const searchParams = useSearchParams()
  const updateParams = useUpdateSearchParams()

  const status = (searchParams.get('status') ?? 'ALL') as TicketStatus | 'ALL'
  const search = searchParams.get('search') ?? ''

  return (
    <div className={cn('flex items-center gap-4')}>
      <div className="w-48">
        <SearchableSelect
          items={STATUSES}
          value={status}
          onChange={(value) => updateParams({ status: value === 'ALL' ? null : value })}
          displayValue={(s) => s}
          placeholder="Filter by status"
        />
      </div>
      <input
        type="search"
        placeholder="Search tickets..."
        defaultValue={search}
        onChange={(e) => updateParams({ search: e.target.value || null })}
        className={cn(
          'flex-1 rounded-lg border px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
        )}
      />
    </div>
  )
}

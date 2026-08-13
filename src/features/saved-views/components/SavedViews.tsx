'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/shared/lib/cn'
import { toQueryString } from '@/shared/lib/searchParams'
import { createSavedView, deleteSavedView } from '@/features/saved-views/actions/manageSavedViews'
import type { SavedViewItem } from '@/features/saved-views/queries/getSavedViews'
import type { TicketStatus } from '@/shared/types/ticket'

type Props = {
  views: SavedViewItem[]
}

export function SavedViews({ views }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState('')

  const applyView = (view: SavedViewItem) => router.replace(`?${toQueryString({ status: view.status, search: view.search })}`)

  const saveCurrent = async () => {
    const result = await createSavedView({
      name,
      status: (searchParams.get('status') as TicketStatus | null) ?? null,
      search: searchParams.get('search')
    })
    if (!result.success) {
      toast.error(result.error)
      return
    }
    setName('')
    toast.success('View saved.')
  }

  const removeView = async (view: SavedViewItem) => {
    const result = await deleteSavedView({ id: view.id })
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success('View removed.')
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2 text-sm')}>
      {views.map((view) => (
        <span key={view.id} className={cn('flex items-center gap-1 rounded-full border pr-1 dark:border-slate-700')}>
          <button
            type="button"
            onClick={() => applyView(view)}
            className={cn('rounded-full px-3 py-1 hover:bg-slate-50 dark:hover:bg-slate-800')}
          >
            {view.name}
          </button>
          <button
            type="button"
            aria-label="Remove saved view"
            onClick={() => removeView(view)}
            className={cn('rounded-full px-1 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100')}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Save current filters as…"
        className={cn('rounded-md border border-slate-300 px-2 py-1 dark:border-slate-700 dark:bg-slate-900')}
      />
      <button
        type="button"
        disabled={name.trim().length === 0}
        onClick={saveCurrent}
        className={cn('rounded bg-blue-600 px-2 py-1 text-white disabled:opacity-50')}
      >
        Save
      </button>
    </div>
  )
}

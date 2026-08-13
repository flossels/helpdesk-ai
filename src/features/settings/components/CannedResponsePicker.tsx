'use client'

import { cn } from '@/shared/lib/cn'
import type { CannedResponseItem } from '@/features/settings/types'

type Props = {
  responses: CannedResponseItem[]
  onSelect: (response: CannedResponseItem) => void
}

const selectClasses = cn(
  'rounded-lg border px-3 py-2 text-sm text-slate-900',
  'focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none',
  'dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
)

export function CannedResponsePicker({ responses, onSelect }: Props) {
  if (responses.length === 0) return null

  return (
    <select
      aria-label="Insert a canned response"
      className={selectClasses}
      value=""
      onChange={(event) => {
        const response = responses.find((item) => item.id === event.target.value)
        if (response) onSelect(response)
      }}
    >
      <option value="" disabled>
        Insert a canned response…
      </option>
      {responses.map((response) => (
        <option key={response.id} value={response.id}>
          {response.title}
        </option>
      ))}
    </select>
  )
}

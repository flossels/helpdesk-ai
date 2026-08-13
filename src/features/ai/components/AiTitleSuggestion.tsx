'use client'

import { useState } from 'react'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { cn } from '@/shared/lib/cn'
import { generateTicketTitle } from '@/features/ai/actions/generateTicketTitle'

const MIN_LENGTH = 50

type Props = {
  description: string
  onUse: (title: string) => void
}

export function AiTitleSuggestion({ description, onUse }: Props) {
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const canSuggest = description.trim().length >= MIN_LENGTH && !loading

  async function suggest() {
    setLoading(true)
    setError(null)
    setSuggestion(null)

    const result = await generateTicketTitle(description)
    setLoading(false)

    if (result.success) setSuggestion(result.data.title)
    else setError(result.error)
  }

  return (
    <div className={cn('mt-2 space-y-2')}>
      <button
        type="button"
        onClick={suggest}
        disabled={!canSuggest}
        className={cn(
          'inline-flex items-center gap-1.5 text-sm text-blue-600 disabled:text-slate-400',
          'dark:text-blue-400 dark:disabled:text-slate-600'
        )}
      >
        <SparklesIcon className={cn('size-4')} />
        {loading ? 'Thinking…' : 'Suggest a subject'}
      </button>

      {suggestion && (
        <div className={cn('flex items-center gap-2 rounded-lg bg-blue-50 p-2 dark:bg-slate-800')}>
          <span className={cn('flex-1 text-sm')}>{suggestion}</span>
          <button
            type="button"
            onClick={() => onUse(suggestion)}
            className={cn('rounded bg-blue-600 px-2 py-1 text-xs text-white')}
          >
            Use
          </button>
        </div>
      )}

      {error && <p className={cn('text-sm text-rose-600')}>{error}</p>}
    </div>
  )
}

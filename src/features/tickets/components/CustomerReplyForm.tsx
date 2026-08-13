'use client'

import { useState, useTransition } from 'react'
import { cn } from '@/shared/lib/cn'
import { customerReply } from '@/features/tickets/actions/customerReply'

type Props = {
  ticketId: string
}

export function CustomerReplyForm({ ticketId }: Props) {
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function send() {
    startTransition(async () => {
      const result = await customerReply({ ticketId, body })

      if (result.success) {
        setBody('')
        setError(null)
        return
      }

      setError(result.fieldErrors?.body?.[0] ?? result.error)
    })
  }

  return (
    <div className={cn('space-y-2')}>
      <label htmlFor="reply" className={cn('text-sm font-medium text-slate-900 dark:text-slate-100')}>
        Your reply
      </label>
      <textarea
        id="reply"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={4}
        className={cn(
          'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm',
          'focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none',
          'dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
        )}
      />
      {error ? <p className={cn('text-sm text-red-600')}>{error}</p> : null}
      <button
        type="button"
        onClick={send}
        disabled={isPending || !body.trim()}
        className={cn('rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white', 'hover:bg-blue-700 disabled:opacity-50')}
      >
        {isPending ? 'Sending...' : 'Send reply'}
      </button>
    </div>
  )
}

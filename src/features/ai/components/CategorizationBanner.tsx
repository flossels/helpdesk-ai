'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/components/ui/Button'
import { resolveCategorization } from '@/features/ai/actions/resolveCategorization'
import type { Categorization } from '@/features/ai/schemas/categorization'

type Props = {
  ticketId: string
  suggestion: Categorization
}

export function CategorizationBanner({ ticketId, suggestion }: Props) {
  const [isPending, startTransition] = useTransition()

  function resolve(decision: 'apply' | 'dismiss') {
    startTransition(async () => {
      const result = await resolveCategorization({ ticketId, decision })
      if (!result.success) toast.error(result.error)
    })
  }

  const percent = Math.round(suggestion.confidence * 100)

  return (
    <div className={cn('rounded-md border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-900 dark:bg-blue-950')}>
      <p>
        AI suggests: <strong>{suggestion.category}</strong> &middot; Priority <strong>{suggestion.priority}</strong> &middot;
        Sentiment <strong>{suggestion.sentiment}</strong> ({percent}% confidence)
      </p>
      <div className={cn('mt-2 flex gap-2')}>
        <Button size="sm" disabled={isPending} onClick={() => resolve('apply')}>
          Apply
        </Button>
        <Button variant="secondary" size="sm" disabled={isPending} onClick={() => resolve('dismiss')}>
          Dismiss
        </Button>
      </div>
    </div>
  )
}

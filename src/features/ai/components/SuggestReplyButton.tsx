'use client'

import { useCompletion } from '@ai-sdk/react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/components/ui/Button'
import { Markdown } from '@/features/copilot/components/Markdown'

type Props = {
  ticketId: string
}

export function SuggestReplyButton({ ticketId }: Props) {
  const { completion, complete, isLoading, error } = useCompletion({
    api: '/api/suggest-reply'
  })

  return (
    <div className={cn('space-y-2')}>
      <Button isLoading={isLoading} onClick={() => complete('', { body: { ticketId } })}>
        Suggest reply
      </Button>

      {error && <p className={cn('text-sm text-rose-600')}>Could not draft a reply.</p>}

      {completion && (
        <div className={cn('rounded-md border p-3 text-sm dark:border-slate-700')}>
          <Markdown>{completion}</Markdown>
        </div>
      )}
    </div>
  )
}

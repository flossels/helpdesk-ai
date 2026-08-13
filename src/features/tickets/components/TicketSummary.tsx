'use client'

import { useCompletion } from '@ai-sdk/react'
import Markdown from 'react-markdown'
import { Card } from '@/shared/components/ui/Card'
import { CardHeader } from '@/shared/components/ui/CardHeader'
import { CardBody } from '@/shared/components/ui/CardBody'
import { cn } from '@/shared/lib/cn'

type Props = {
  ticketId: string
}

export function TicketSummary({ ticketId }: Props) {
  const { completion, complete, isLoading, stop, error } = useCompletion({
    api: '/api/summarize',
    body: { ticketId }
  })

  return (
    <Card>
      <CardHeader className={cn('flex items-center justify-between')}>
        <h2 className={cn('text-sm font-semibold text-slate-900 dark:text-slate-100')}>AI Summary</h2>
        {isLoading ? (
          <button type="button" onClick={() => stop()} className={cn('text-sm text-blue-600 dark:text-blue-400')}>
            Stop generating
          </button>
        ) : (
          <button type="button" onClick={() => complete('')} className={cn('text-sm text-blue-600 dark:text-blue-400')}>
            {completion ? 'Regenerate' : 'Summarize thread'}
          </button>
        )}
      </CardHeader>
      <CardBody>
        {completion && (
          <div className={cn('prose prose-sm dark:prose-invert max-w-none')}>
            <Markdown>{completion}</Markdown>
          </div>
        )}
        {error && <p className={cn('text-sm text-rose-600')}>Could not generate a summary. Try again.</p>}
      </CardBody>
    </Card>
  )
}

'use client'

import { cn } from '@/shared/lib/cn'
import { ArticleCard } from '@/features/copilot/components/cards/ArticleCard'
import { TicketListCard } from '@/features/copilot/components/cards/TicketListCard'
import type { ArticleResult, TicketSearchResult } from '@/features/copilot/components/cards/types'

type Props = {
  name: string
  output: unknown
}

function toolError(output: unknown): string | null {
  if (typeof output !== 'object' || output === null) return null
  if (!('error' in output)) return null
  return String((output as { error: unknown }).error)
}

export function ToolResult({ name, output }: Props) {
  const error = toolError(output)
  if (error) return <p className={cn('text-sm text-rose-600')}>{error}</p>

  switch (name) {
    case 'searchTickets':
      if (!Array.isArray(output)) break
      return <TicketListCard tickets={output as TicketSearchResult[]} />
    case 'findSimilarTickets':
      if (!Array.isArray(output)) break
      return <TicketListCard tickets={output as TicketSearchResult[]} title="Similar tickets" />
    case 'draftReply':
      return (
        <p className={cn('rounded-md border border-slate-200 p-2 text-sm whitespace-pre-wrap dark:border-slate-700')}>
          {String((output as { draft?: string }).draft ?? '')}
        </p>
      )
    case 'searchKnowledge':
      if (!Array.isArray(output)) break
      if (output.length === 0) {
        return <p className={cn('text-sm text-slate-500')}>No articles found.</p>
      }
      return (
        <div className={cn('space-y-1')}>
          {(output as ArticleResult[]).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )
  }

  return (
    <div className={cn('rounded-md border border-slate-200 p-2 text-sm dark:border-slate-700')}>
      <p className={cn('mb-1 font-medium text-slate-500')}>{name}</p>
      <pre className={cn('overflow-x-auto text-xs')}>{JSON.stringify(output, null, 2)}</pre>
    </div>
  )
}

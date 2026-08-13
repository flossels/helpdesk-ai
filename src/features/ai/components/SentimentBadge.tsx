import { cn } from '@/shared/lib/cn'
import type { Sentiment } from '@/features/ai/schemas/categorization'

const STYLES: Record<Sentiment, string> = {
  POSITIVE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  NEUTRAL: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  NEGATIVE: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
}

type Props = {
  sentiment: Sentiment
}

export function SentimentBadge({ sentiment }: Props) {
  return <span className={cn('rounded px-2 py-0.5 text-xs font-medium', STYLES[sentiment])}>{sentiment}</span>
}

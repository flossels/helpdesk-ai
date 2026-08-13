import { cn } from '@/shared/lib/cn'

export function SummarySkeleton() {
  return (
    <div
      className={cn(
        'rounded-(--border-radius) border border-slate-200 bg-white p-4 shadow-sm',
        'dark:border-slate-700 dark:bg-slate-800'
      )}
    >
      <div className={cn('mb-4 h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700')} />
      <div className={cn('space-y-2')}>
        <div className={cn('h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700')} />
        <div className={cn('h-3 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700')} />
        <div className={cn('h-3 w-4/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700')} />
      </div>
    </div>
  )
}

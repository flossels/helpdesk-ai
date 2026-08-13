import { cn } from '@/shared/lib/cn'

export function ReplyFormSkeleton() {
  return (
    <div className={cn('space-y-3')}>
      <div className={cn('h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700')} />
      <div className={cn('h-32 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800')} />
      <div className={cn('h-9 w-28 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700')} />
    </div>
  )
}

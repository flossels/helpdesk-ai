import { cn } from '@/shared/lib/cn'

export function HeaderSkeleton() {
  return (
    <header>
      <div className={cn('h-12 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700')} />
      <dl className={cn('my-6 grid grid-cols-1 gap-x-6 gap-y-3')}>
        <dt className={cn('col-end-1 h-5 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700')} />
        <dd className={cn('h-5 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700')} />
      </dl>
    </header>
  )
}

import { cn } from '@/shared/lib/cn'

export function ThreadSkeleton() {
  return (
    <div className={cn('space-y-4')}>
      <div className={cn('h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700')} />
      <div className={cn('space-y-3')}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={cn('flex', i % 2 === 0 ? 'justify-start' : 'justify-end')}>
            <div className={cn('h-12 w-2/3 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800')} />
          </div>
        ))}
      </div>
    </div>
  )
}

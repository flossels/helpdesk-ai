import { cn } from '@/shared/lib/cn'

export function MetricsSkeleton() {
  return (
    <div className={cn('grid grid-cols-2 gap-4 sm:grid-cols-4')}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={cn('h-24 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800')} />
      ))}
    </div>
  )
}

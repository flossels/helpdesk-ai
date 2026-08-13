import { cn } from '@/shared/lib/cn'

export function StatusControlSkeleton() {
  return <div className={cn('h-10 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700')} />
}

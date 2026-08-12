import { cn } from '@/shared/lib/cn'

export function TicketListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={cn('flex animate-pulse items-center gap-3 rounded-lg bg-slate-100 p-4 dark:bg-slate-800')}>
          <div className={cn('h-5 w-16 rounded bg-slate-200 dark:bg-slate-700')} />
          <div className={cn('h-5 flex-1 rounded bg-slate-200 dark:bg-slate-700')} />
          <div className={cn('h-5 w-24 rounded bg-slate-200 dark:bg-slate-700')} />
        </div>
      ))}
    </div>
  )
}

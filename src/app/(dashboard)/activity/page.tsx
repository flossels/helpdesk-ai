import { Suspense } from 'react'
import { cn } from '@/shared/lib/cn'
import { ActivityFeed } from '@/features/activity/components/ActivityFeed'

export default function ActivityPage({ searchParams }: PageProps<'/activity'>) {
  return (
    <div className={cn('space-y-6 py-2')}>
      <h1>Activity</h1>
      <Suspense fallback={<p className={cn('text-sm text-slate-500')}>Loading activity…</p>}>
        <ActivityFeed searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

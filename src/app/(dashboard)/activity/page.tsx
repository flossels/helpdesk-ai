import { Suspense } from 'react'
import { forbidden } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { ActivityFeed } from '@/features/activity/components/ActivityFeed'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'

export default async function ActivityPage({ searchParams }: PageProps<'/activity'>) {
  const user = await getCurrentUser()
  if (!user?.organizationId) forbidden()

  const { cursor } = await searchParams

  return (
    <div className={cn('space-y-6 py-2')}>
      <h1>Activity</h1>
      <Suspense fallback={<p className={cn('text-sm text-slate-500')}>Loading activity…</p>}>
        <ActivityFeed organizationId={user.organizationId} cursor={typeof cursor === 'string' ? cursor : undefined} />
      </Suspense>
    </div>
  )
}

import { Suspense } from 'react'
import { forbidden } from 'next/navigation'
import { hasScope } from '@/shared/lib/authorization'
import { ChartSkeleton } from '@/features/dashboard/components/ChartSkeleton'
import { DashboardContent } from '@/features/dashboard/components/DashboardContent'
import { DashboardMetrics } from '@/features/dashboard/components/DashboardMetrics'
import { MetricsSkeleton } from '@/features/dashboard/components/MetricsSkeleton'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getDashboardMetrics } from '@/features/dashboard/queries/getDashboardMetrics'

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardPageContent />
    </Suspense>
  )
}

async function DashboardPageContent() {
  const user = await getCurrentUser()
  if (!user?.organizationId || !hasScope(user.scopes, 'analytics:view')) forbidden()

  const metrics = await getDashboardMetrics(user.organizationId)

  return (
    <div className="space-y-8 py-2">
      <h1>Dashboard</h1>

      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics initial={metrics} />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <DashboardContent initial={metrics} />
      </Suspense>
    </div>
  )
}

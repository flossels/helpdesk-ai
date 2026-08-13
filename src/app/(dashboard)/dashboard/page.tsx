import { Suspense } from 'react'
import { forbidden } from 'next/navigation'
import { hasScope } from '@/shared/lib/authorization'
import { ChartSkeleton } from '@/features/dashboard/components/ChartSkeleton'
import { DashboardMetrics } from '@/features/dashboard/components/DashboardMetrics'
import { MetricsSkeleton } from '@/features/dashboard/components/MetricsSkeleton'
import { TicketVolumeChart } from '@/features/dashboard/components/TicketVolumeChart'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardPageContent />
    </Suspense>
  )
}

async function DashboardPageContent() {
  const user = await getCurrentUser()
  if (!user || !hasScope(user.scopes, 'analytics:view')) forbidden()

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="my-6 flex gap-12">
        <Suspense fallback={<MetricsSkeleton />}>
          <DashboardMetrics />
        </Suspense>

        <Suspense fallback={<ChartSkeleton />}>
          <TicketVolumeChart />
        </Suspense>
      </div>
    </div>
  )
}

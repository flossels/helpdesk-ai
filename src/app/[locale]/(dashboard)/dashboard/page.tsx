import { Suspense } from 'react'
import { ChartSkeleton } from '@/features/dashboard/components/ChartSkeleton'
import { DashboardChartsSection } from '@/features/dashboard/components/DashboardChartsSection'
import { DashboardMetricsSection } from '@/features/dashboard/components/DashboardMetricsSection'
import { MetricsSkeleton } from '@/features/dashboard/components/MetricsSkeleton'

export default function DashboardPage() {
  return (
    <div className="space-y-8 py-2">
      <h1>Dashboard</h1>

      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetricsSection />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <DashboardChartsSection />
      </Suspense>
    </div>
  )
}

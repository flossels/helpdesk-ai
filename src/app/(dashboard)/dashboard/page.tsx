import { Suspense } from 'react'
import { MetricsSkeleton } from '@/features/dashboard/components/MetricsSkeleton'
import { DashboardMetrics } from '@/features/dashboard/components/DashboardMetrics'
import { ChartSkeleton } from '@/features/dashboard/components/ChartSkeleton'
import { TicketVolumeChart } from '@/features/dashboard/components/TicketVolumeChart'

export default function DashboardPage() {
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

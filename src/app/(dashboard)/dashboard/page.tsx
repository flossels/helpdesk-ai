import { Suspense } from 'react'
import { MetricsSkeleton } from '@/shared/components/MetricsSkeleton'
import { DashboardMetrics } from '@/shared/components/DashboardMetrics'
import { ChartSkeleton } from '@/shared/components/ChartSkeleton'
import { TicketVolumeChart } from '@/shared/components/TicketVolumeChart'

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

'use client'

import dynamic from 'next/dynamic'
import { cn } from '@/shared/lib/cn'
import { useDashboardMetrics } from '@/features/dashboard/hooks/useDashboardMetrics'
import { ChartSkeleton } from '@/features/dashboard/components/ChartSkeleton'
import type { DashboardMetrics } from '@/features/dashboard/types'

const TicketVolumeChart = dynamic(
  () => import('@/features/dashboard/components/TicketVolumeChart').then((mod) => mod.TicketVolumeChart),
  { loading: () => <ChartSkeleton />, ssr: false }
)

const CategoryDistributionChart = dynamic(
  () => import('@/features/dashboard/components/CategoryDistributionChart').then((mod) => mod.CategoryDistributionChart),
  { loading: () => <ChartSkeleton />, ssr: false }
)

type Props = {
  initial: DashboardMetrics
}

export function DashboardContent({ initial }: Props) {
  const metrics = useDashboardMetrics(initial)

  return (
    <div className={cn('grid grid-cols-1 gap-6 md:grid-cols-2')}>
      <TicketVolumeChart data={metrics.volume} />
      <CategoryDistributionChart data={metrics.categories} />
    </div>
  )
}

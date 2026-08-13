'use client'

import { cn } from '@/shared/lib/cn'
import { useDashboardMetrics } from '@/features/dashboard/hooks/useDashboardMetrics'
import { TicketVolumeChart } from '@/features/dashboard/components/TicketVolumeChart'
import { CategoryDistributionChart } from '@/features/dashboard/components/CategoryDistributionChart'
import type { DashboardMetrics } from '@/features/dashboard/types'

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

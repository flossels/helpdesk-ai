'use client'

import { cn } from '@/shared/lib/cn'
import { useDashboardMetrics } from '@/features/dashboard/hooks/useDashboardMetrics'
import type { DashboardMetrics as Metrics } from '@/features/dashboard/types'

type Props = {
  initial: Metrics
}

export function DashboardMetrics({ initial }: Props) {
  const metrics = useDashboardMetrics(initial)

  return (
    <div className={cn('flex gap-12')}>
      <div>
        <div className={cn('text-sm text-slate-500')}>Open tickets</div>
        <div className={cn('text-3xl font-semibold text-slate-900 dark:text-slate-100')}>{metrics.openTickets}</div>
      </div>
      <div>
        <div className={cn('text-sm text-slate-500')}>Avg first response</div>
        <div className={cn('text-3xl font-semibold text-slate-900 dark:text-slate-100')}>
          {metrics.avgFirstResponseMinutes === null ? '–' : `${metrics.avgFirstResponseMinutes}m`}
        </div>
      </div>
    </div>
  )
}

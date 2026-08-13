'use client'

import useSWR from 'swr'
import type { DashboardMetrics } from '@/features/dashboard/types'

export function useDashboardMetrics(initial: DashboardMetrics) {
  const { data } = useSWR<DashboardMetrics>('/api/dashboard/metrics', {
    fallbackData: initial,
    refreshInterval: 30_000
  })

  return data ?? initial
}

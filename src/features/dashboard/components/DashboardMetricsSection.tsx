import { forbidden } from 'next/navigation'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getDashboardMetrics } from '@/features/dashboard/queries/getDashboardMetrics'
import { DashboardMetrics } from '@/features/dashboard/components/DashboardMetrics'

export async function DashboardMetricsSection() {
  const user = await getCurrentUser()
  if (!user?.organizationId || !hasScope(user.scopes, 'analytics:view')) forbidden()

  const metrics = await getDashboardMetrics(user.organizationId)

  return <DashboardMetrics initial={metrics} />
}

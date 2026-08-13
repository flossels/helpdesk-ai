import { forbidden } from 'next/navigation'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getDashboardMetrics } from '@/features/dashboard/queries/getDashboardMetrics'
import { DashboardContent } from '@/features/dashboard/components/DashboardContent'

export async function DashboardChartsSection() {
  const user = await getCurrentUser()
  if (!user?.organizationId || !hasScope(user.scopes, 'analytics:view')) forbidden()

  const metrics = await getDashboardMetrics(user.organizationId)

  return <DashboardContent initial={metrics} />
}

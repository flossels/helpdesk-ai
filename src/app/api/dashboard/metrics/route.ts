import { errorResponse } from '@/shared/lib/apiResponse'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getDashboardMetrics } from '@/features/dashboard/queries/getDashboardMetrics'

export async function GET() {
  const user = await getCurrentUser()
  if (!user?.organizationId) return errorResponse('Not authenticated.', 401)
  if (!hasScope(user.scopes, 'analytics:view')) return errorResponse('Insufficient permissions.', 403)

  return Response.json(await getDashboardMetrics(user.organizationId))
}

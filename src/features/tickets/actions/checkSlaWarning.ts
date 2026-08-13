'use server'

import { unstable_rethrow } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'
import { hasScope } from '@/shared/lib/authorization'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { warnSlaBreach } from '@/features/tickets/lib/warnSlaBreach'

export async function checkSlaWarning(ticketId: string) {
  try {
    const user = await getCurrentUser()
    if (!user?.organizationId) return
    if (!hasScope(user.scopes, 'tickets:read')) return

    await warnSlaBreach(ticketId, user.organizationId, user.id)
  } catch (error) {
    unstable_rethrow(error)
    Sentry.captureException(error)
    console.error('SLA warning check failed:', error)
  }
}

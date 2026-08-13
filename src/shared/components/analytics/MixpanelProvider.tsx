'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ANALYTICS_EVENTS } from '@/shared/lib/analytics/events'
import { useConsent } from '@/shared/lib/analytics/consent'
import { identifyUser, initMixpanel, stopAnalytics, trackClientEvent } from '@/shared/lib/analytics/mixpanelClient'

export function MixpanelProvider() {
  const { granted } = useConsent()
  const { data: session } = useSession()
  const pathname = usePathname()
  const user = session?.user

  useEffect(() => {
    if (!granted) {
      stopAnalytics()
      return
    }
    initMixpanel()
    if (user?.id && user.organizationId) {
      identifyUser(user.id, { organizationId: user.organizationId })
    }
  }, [granted, user?.id, user?.organizationId])

  useEffect(() => {
    if (granted) trackClientEvent(ANALYTICS_EVENTS.pageViewed, { path: pathname })
  }, [granted, pathname])

  return null
}

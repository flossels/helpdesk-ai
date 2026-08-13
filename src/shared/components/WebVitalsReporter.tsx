'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { ANALYTICS_EVENTS } from '@/shared/lib/analytics/events'
import { trackClientEvent } from '@/shared/lib/analytics/mixpanelClient'

const DYNAMIC_SEGMENT = /^(c[a-z0-9]{20,}|[0-9a-f]{8}-[0-9a-f-]{27}|HD-\d+)$/i

function routePattern(pathname: string) {
  return (
    pathname
      .split('/')
      .map((segment) => (DYNAMIC_SEGMENT.test(segment) ? '[id]' : segment))
      .join('/') || '/'
  )
}

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    trackClientEvent(ANALYTICS_EVENTS.webVitalMeasured, {
      name: metric.name,
      value: metric.name === 'CLS' ? metric.value : Math.round(metric.value),
      rating: metric.rating,
      metricId: metric.id,
      route: routePattern(window.location.pathname),
      navigationType: metric.navigationType
    })
  })

  return null
}

'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const value = metric.name === 'CLS' ? metric.value : Math.round(metric.value)
    console.warn(metric.name, value)
  })

  return null
}

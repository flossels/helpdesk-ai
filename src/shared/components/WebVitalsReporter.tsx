'use client'

import { useReportWebVitals } from 'next/web-vitals'

// Reports each Core Web Vital as the browser measures it. We log the
// numbers locally to read a baseline; Chapter 23 forwards them to
// product analytics for real-user monitoring.
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // CLS is a unitless score well below 1, so rounding it would report
    // every reading as 0. Every other metric is a duration in ms.
    const value = metric.name === 'CLS' ? metric.value : Math.round(metric.value)
    console.warn(metric.name, value)
  })

  return null
}

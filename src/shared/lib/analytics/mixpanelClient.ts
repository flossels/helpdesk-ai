'use client'

import mixpanel from 'mixpanel-browser'

let initialized = false

export function initMixpanel() {
  if (initialized) return
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
  if (!token) return
  mixpanel.init(token, {
    api_host: 'https://api-eu.mixpanel.com',
    persistence: 'localStorage',
    track_pageview: false
  })
  initialized = true
}

export function trackClientEvent(event: string, properties: Record<string, unknown> = {}) {
  if (!initialized) return
  mixpanel.track(event, { ...properties, source: 'client' })
}

export function identifyUser(userId: string, properties: Record<string, unknown>) {
  if (!initialized) return
  mixpanel.identify(userId)
  mixpanel.people.set(properties)
}

export function stopAnalytics() {
  if (!initialized) return
  mixpanel.opt_out_tracking()
}

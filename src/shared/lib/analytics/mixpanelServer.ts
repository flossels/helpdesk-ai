import 'server-only'

import Mixpanel from 'mixpanel'

let client: ReturnType<typeof Mixpanel.init> | null = null

function getClient(): ReturnType<typeof Mixpanel.init> | null {
  if (client) return client
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
  if (!token) return null
  client = Mixpanel.init(token, { host: 'api-eu.mixpanel.com' })
  return client
}

export function trackServerEvent(event: string, distinctId: string, properties: Record<string, unknown> = {}): Promise<void> {
  const mixpanel = getClient()
  if (!mixpanel) return Promise.resolve()

  return new Promise((resolve) => {
    mixpanel.track(event, { distinct_id: distinctId, source: 'server', ...properties }, () => resolve())
  })
}

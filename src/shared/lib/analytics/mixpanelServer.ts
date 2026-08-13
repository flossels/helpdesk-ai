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

// Returns a promise so the caller can await it. The SDK's track() is
// callback-based and fire-and-forget otherwise, which would defeat the
// point of scheduling it with after(). We resolve on failure too: a
// dropped analytics event must never surface as a failed request.
export function trackServerEvent(event: string, distinctId: string, properties: Record<string, unknown> = {}): Promise<void> {
  const mixpanel = getClient()
  if (!mixpanel) return Promise.resolve()

  return new Promise((resolve) => {
    mixpanel.track(event, { distinct_id: distinctId, source: 'server', ...properties }, () => resolve())
  })
}

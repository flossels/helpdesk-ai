import 'server-only'

import { createHmac } from 'node:crypto'
import { db } from '@/shared/lib/db'

type WebhookEvent = { type: string; data: unknown }

export async function dispatchWebhooks(organizationId: string, event: WebhookEvent) {
  const hooks = await db.webhook.findMany({
    where: { organizationId, isActive: true }
  })

  const body = JSON.stringify({ ...event, timestamp: new Date().toISOString() })

  await Promise.allSettled(
    hooks
      .filter((hook) => (hook.events as string[]).includes(event.type))
      .map((hook) => {
        const signature = createHmac('sha256', hook.secret).update(body).digest('hex')
        return fetch(hook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Helpdesk-Signature': signature
          },
          body
        })
      })
  )
}

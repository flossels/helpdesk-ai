import { subscribe } from '@/shared/lib/eventBus'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'

export async function GET() {
  const user = await getCurrentUser()
  if (!user?.organizationId) return new Response('Unauthorized', { status: 401 })

  const organizationId = user.organizationId
  const encoder = new TextEncoder()
  let unsubscribe = () => {}
  let heartbeat: ReturnType<typeof setInterval>

  const stream = new ReadableStream({
    start(controller) {
      const send = (chunk: string) => controller.enqueue(encoder.encode(chunk))

      // Open the stream immediately. Until the first byte arrives the browser
      // holds the request in CONNECTING and proxies may time it out.
      send(`retry: 5000\n: connected\n\n`)

      unsubscribe = subscribe((event) => {
        if (event.organizationId !== organizationId) return
        send(`event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`)
      })

      heartbeat = setInterval(() => send(`: ping\n\n`), 30_000)
    },
    // Runs when the client disconnects and the stream is canceled.
    cancel() {
      clearInterval(heartbeat)
      unsubscribe()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  })
}

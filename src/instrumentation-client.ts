import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  // 10% of navigations for performance, 1% of clean sessions for replay,
  // and a replay for every error, a video-like trace of what the user did.
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.replayIntegration()],
  enabled: process.env.NODE_ENV === 'production',
  // The wizard's answer to its privacy prompt. genAI is the entry that
  // matters for a support desk: prompts and completions carry customer text.
  dataCollection: {
    userInfo: false,
    graphQL: { document: false, variables: false },
    genAI: { inputs: false, outputs: false },
    databaseQueryData: false,
    queues: false,
    httpBodies: [],
    httpHeaders: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
    cookies: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
    urlQueryParams: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] }
  },
  beforeSend(event) {
    // Never let session cookies reach Sentry.
    if (event.request?.cookies) event.request.cookies = {}
    return event
  }
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart

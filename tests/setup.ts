import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// The instrumented actions and routes import @sentry/nextjs for spans
// and captures. In tests we stub it to a no-op (a span just runs its
// callback), so the suite stays fast and free of the real SDK.
vi.mock('@sentry/nextjs', () => ({
  startSpan: (_options: unknown, callback: (span?: unknown) => unknown) => callback(),
  captureException: () => {},
  captureMessage: () => {},
  captureRequestError: () => {},
  captureRouterTransitionStart: () => {}
}))

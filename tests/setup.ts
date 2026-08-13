import '@testing-library/jest-dom/vitest'

import { vi } from 'vitest'

vi.mock('@sentry/nextjs', () => ({
  startSpan: (_options: unknown, callback: (span?: unknown) => unknown) => callback(),
  captureException: () => {},
  captureMessage: () => {},
  captureRequestError: () => {},
  captureRouterTransitionStart: () => {}
}))

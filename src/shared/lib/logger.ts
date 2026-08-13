import 'server-only'

import pino from 'pino'

// Structured JSON in production, pretty-printed in development. The
// pino-pretty transport runs in a worker thread, so we enable it only in
// development; production and tests write plain JSON to stdout.
const isDev = process.env.NODE_ENV === 'development'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['*.password', '*.token', '*.authorization', 'req.headers.cookie'],
  ...(isDev ? { transport: { target: 'pino-pretty', options: { colorize: true } } } : {})
})

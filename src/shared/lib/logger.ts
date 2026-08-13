import 'server-only'

import pino from 'pino'

const isDev = process.env.NODE_ENV === 'development'

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: ['*.password', '*.token', '*.authorization', 'req.headers.cookie'],
  ...(isDev ? { transport: { target: 'pino-pretty', options: { colorize: true } } } : {})
})

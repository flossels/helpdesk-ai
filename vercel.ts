import type { VercelConfig } from '@vercel/config/v1'

const isProduction = process.env.VERCEL_ENV === 'production'

export const config: VercelConfig = {
  framework: 'nextjs',
  headers: isProduction
    ? []
    : [
        {
          source: '/(.*)',
          headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
        }
      ],
  crons: [{ path: '/api/cron/sla-check', schedule: '0 9 * * *' }]
}

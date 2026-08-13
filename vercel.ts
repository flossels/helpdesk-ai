import type { VercelConfig } from '@vercel/config/v1'

// VERCEL_ENV is 'production' only for the production deployment. Preview and
// development deployments get a noindex header so a staging URL never shows
// up in search results.
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

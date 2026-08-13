import { withSentryConfig } from '@sentry/nextjs'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin()

const isDev = process.env.NODE_ENV === 'development'

const contentSecurityPolicy = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' blob: data: https://*.googleusercontent.com https://helpdesk-ai-attachments.s3.amazonaws.com`,
  `font-src 'self'`,
  `connect-src 'self' https://api-eu.mixpanel.com`,
  `object-src 'none'`,
  `frame-ancestors 'none'`,
  `form-action 'self'`,
  `base-uri 'self'`,
  `upgrade-insecure-requests`
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }
]

const nextConfig: NextConfig = {
  output: process.env.VERCEL || process.env.E2E ? undefined : 'standalone',
  deploymentId: process.env.DEPLOYMENT_ID,
  reactStrictMode: true,
  poweredByHeader: false,
  headers: async () => [{ source: '/(.*)', headers: securityHeaders }],
  reactCompiler: true,
  typedRoutes: true,
  cacheComponents: true,
  partialPrefetching: true,
  logging: {
    browserToTerminal: 'warn',
    fetches: { fullUrl: true },
    incomingRequests: { ignore: [/^\/api\/dashboard\/metrics$/] }
  },
  experimental: {
    typedEnv: true,
    authInterrupts: true,
    exposeTestingApiInProductionBuild: true
  },
  cacheLife: {
    articles: {
      stale: 300,
      revalidate: 21600,
      expire: 86400
    }
  },
  images: {
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'helpdesk-ai-attachments.s3.amazonaws.com'
      }
    ]
  }
}

export default withSentryConfig(withNextIntl(nextConfig), {
  org: 'helpdesk-ai',
  project: 'helpdesk-web',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  sourcemaps: { deleteSourcemapsAfterUpload: true }
})

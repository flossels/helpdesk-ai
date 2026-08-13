import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  typedRoutes: true,
  agentRules: false,
  cacheComponents: true,
  partialPrefetching: true,
  logging: {
    browserToTerminal: 'warn'
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

export default nextConfig

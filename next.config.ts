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
    typedEnv: true
  },
  cacheLife: {
    articles: {
      stale: 300,
      revalidate: 21600,
      expire: 86400
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com'
      }
    ]
  }
}

export default nextConfig

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactStrictMode: true,
  reactCompiler: true,
  typedRoutes: true,
  logging: {
    browserToTerminal: 'warn'
  },
  experimental: {
    typedEnv: true
  },
  cacheLife: {
    'knowledge-base': {
      stale: 300,
      revalidate: 3600,
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

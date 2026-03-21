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

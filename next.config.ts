import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  typedRoutes: true,
  logging: {
    browserToTerminal: 'warn'
  },
  experimental: {
    typedEnv: true
  }
}

export default nextConfig

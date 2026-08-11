import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  typedRoutes: true,
  agentRules: false,
  logging: {
    browserToTerminal: 'warn'
  },
  experimental: {
    typedEnv: true
  }
}

export default nextConfig

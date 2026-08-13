import { connection } from 'next/server'
import { db } from '@/shared/lib/db'

export async function GET() {
  await connection()

  const checks: Record<string, string> = {}

  try {
    await db.$queryRaw`SELECT 1`
    checks.database = 'ok'
  } catch {
    checks.database = 'error'
  }

  if (process.env.REDIS_URL) {
    try {
      const { redis } = await import('@/shared/lib/redis')
      await redis.ping()
      checks.redis = 'ok'
    } catch {
      checks.redis = 'error'
    }
  }

  const healthy = Object.values(checks).every((value) => value === 'ok')

  return Response.json(
    {
      status: healthy ? 'healthy' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION ?? 'unknown'
    },
    { status: healthy ? 200 : 503 }
  )
}

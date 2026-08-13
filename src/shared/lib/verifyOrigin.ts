import 'server-only'

import { headers } from 'next/headers'

export async function verifyOrigin(): Promise<boolean> {
  const origin = (await headers()).get('origin')
  if (!origin) return false
  return origin === process.env.APP_URL
}

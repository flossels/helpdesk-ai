import { db } from '@/shared/lib/db'

export async function generateTrackingId(): Promise<string> {
  const count = await db.ticket.count()

  return `HD-${String(count + 1).padStart(4, '0')}`
}

import { db } from '@/shared/lib/db'

// Sequential, human-readable ticket reference (HD-0001, HD-0002, …).
// Counting is good enough here; a production system would use a
// per-organization database sequence to stay race-free under load.
export async function generateTrackingId(): Promise<string> {
  const count = await db.ticket.count()

  return `HD-${String(count + 1).padStart(4, '0')}`
}

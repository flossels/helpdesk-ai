import { db } from '@/shared/lib/db'

export async function findOrCreateCustomer(email: string, name?: string) {
  const normalized = email.trim().toLowerCase()
  return db.user.upsert({
    where: { email: normalized },
    update: {},
    create: {
      email: normalized,
      name: name ?? normalized.split('@')[0] ?? normalized,
      role: 'CUSTOMER'
    },
    select: { id: true }
  })
}

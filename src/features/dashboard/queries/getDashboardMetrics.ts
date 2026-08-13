import 'server-only'

import { cache } from 'react'
import { db } from '@/shared/lib/db'
import type { DashboardMetrics, VolumePoint } from '@/features/dashboard/types'

const DAY = 24 * 60 * 60 * 1000
const VOLUME_DAYS = 30

export const getDashboardMetrics = cache(async (organizationId: string): Promise<DashboardMetrics> => {
  const now = new Date()
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const since = new Date(today - (VOLUME_DAYS - 1) * DAY)

  const [openTickets, recent, byCategory] = await Promise.all([
    db.ticket.count({
      where: {
        organizationId,
        isDeleted: false,
        status: { in: ['OPEN', 'IN_PROGRESS'] }
      }
    }),
    db.ticket.findMany({
      where: { organizationId, isDeleted: false, createdAt: { gte: since } },
      select: { createdAt: true }
    }),
    db.category.findMany({
      where: { organizationId },
      select: {
        name: true,
        color: true,
        _count: { select: { tickets: true } }
      },
      orderBy: { name: 'asc' }
    })
  ])

  const counts = new Map<string, number>()
  for (const ticket of recent) {
    const day = ticket.createdAt.toISOString().slice(0, 10)
    counts.set(day, (counts.get(day) ?? 0) + 1)
  }

  const volume: VolumePoint[] = Array.from({ length: VOLUME_DAYS }, (_, index) => {
    const date = new Date(since.getTime() + index * DAY).toISOString().slice(0, 10)
    return { date, count: counts.get(date) ?? 0 }
  })

  return {
    openTickets,
    avgFirstResponseMinutes: null,
    volume,
    categories: byCategory.map((category) => ({
      name: category.name,
      count: category._count.tickets,
      color: category.color
    }))
  }
})

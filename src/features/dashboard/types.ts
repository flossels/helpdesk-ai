export type VolumePoint = { date: string; count: number }

export type CategorySlice = { name: string; count: number; color: string }

export type DashboardMetrics = {
  openTickets: number
  avgFirstResponseMinutes: number | null
  volume: VolumePoint[]
  categories: CategorySlice[]
}

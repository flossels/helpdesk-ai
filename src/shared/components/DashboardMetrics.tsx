import { cookies } from 'next/headers'

export async function DashboardMetrics() {
  // Dynamic: reads cookies for org context
  const cookieStore = await cookies()
  const orgId = cookieStore.get('orgId')?.value

  // Simulated metrics fetch
  await new Promise((r) => setTimeout(r, 1000))

  return (
    <div>
      <div>Org: {orgId}</div>
      <div>Open tickets: 42</div>
      <div>Avg response: 2.3h</div>
    </div>
  )
}

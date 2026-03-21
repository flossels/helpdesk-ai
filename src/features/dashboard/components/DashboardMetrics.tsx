import { cookies } from 'next/headers'

const DashboardMetrics = async () => {
  const cookieStore = await cookies()
  const orgId = cookieStore.get('orgId')?.value

  await new Promise((r) => setTimeout(r, 1000))

  return (
    <div>
      <div>Org: {orgId}</div>
      <div>Open tickets: 42</div>
      <div>Avg response: 2.3h</div>
    </div>
  )
}

export default DashboardMetrics

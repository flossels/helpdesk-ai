import { Suspense } from 'react'
import { TrackingStatus } from '@/features/tracking/components/TrackingStatus'

export default function TrackingPage({ params }: PageProps<'/track/[trackingId]'>) {
  return (
    <div>
      <h1>Track Your Ticket</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <TrackingStatus params={params} />
      </Suspense>
    </div>
  )
}

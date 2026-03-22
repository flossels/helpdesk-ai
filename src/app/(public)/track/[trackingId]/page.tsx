import TrackingStatus from '@/features/tracking/TrackingStatus'
import { Suspense } from 'react'

export default async function TrackingPage({ params }: PageProps<'/track/[trackingId]'>) {
  const { trackingId } = await params

  return (
    <div>
      <h1>Track Your Ticket</h1>
      <p>Tracking ID: {trackingId}</p>
      <Suspense fallback={<p>Loading...</p>}>
        <TrackingStatus trackingId={trackingId} />
      </Suspense>
    </div>
  )
}

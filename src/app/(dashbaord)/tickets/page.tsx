import TicketFilterBar from '@/features/tickets/components/TicketFilterBar'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function TicketsPage({ searchParams }: PageProps<'/tickets'>) {
  const { status, search } = await searchParams

  return (
    <div>
      <h1>Tickets</h1>
      <Suspense fallback={null}>
        <TicketFilterBar />
      </Suspense>
      <p className="pt-4">
        Status: {status ?? 'All'}
        {' | '}
        Search: {search ?? 'None'}
      </p>
      <ul>
        <li>
          <Link href="/tickets/HD-1001">HD-1001: Login page broken</Link>
        </li>
        <li>
          <Link href="/tickets/HD-1002">HD-1002: Cannot reset password</Link>
        </li>
        <li>
          <Link href="/tickets/HD-1003">HD-1003: Dashboard loads slowly</Link>
        </li>
      </ul>
    </div>
  )
}

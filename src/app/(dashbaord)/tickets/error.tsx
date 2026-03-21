'use client'

import type { ErrorInfo } from 'next/error'

export default function TicketsError({ error, unstable_retry }: ErrorInfo) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={unstable_retry}>Try again</button>
    </div>
  )
}

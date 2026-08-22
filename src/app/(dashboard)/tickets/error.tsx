'use client'

import type { ErrorInfo } from 'next/error'

export default function TicketsError({ error, retry }: ErrorInfo) {
  const message = error instanceof Error ? error.message : 'Unknown error'

  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{message}</p>
      <button onClick={retry}>Try again</button>
    </div>
  )
}

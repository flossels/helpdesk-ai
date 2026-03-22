'use client'

import Button from '@/shared/components/ui/Button'
import type { ErrorInfo } from 'next/error'

export default function TicketsError({ unstable_retry }: ErrorInfo) {
  return (
    <html lang="en">
      <body>
        <h1>Something went wrong</h1>
        <Button onClick={unstable_retry}>Try again</Button>
      </body>
    </html>
  )
}

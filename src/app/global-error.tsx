'use client'

import type { ErrorInfo } from 'next/error'

export default function GlobalError({ retry }: ErrorInfo) {
  return (
    <html lang="en">
      <body>
        <h1>Something went wrong</h1>
        <button onClick={retry}>Try again</button>
      </body>
    </html>
  )
}

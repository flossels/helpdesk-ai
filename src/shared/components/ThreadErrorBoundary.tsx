'use client'

import { catchError } from 'next/error'
import type { ErrorInfo } from 'next/error'

// The fallback takes the boundary's own props first, then the error info.
// This one needs no props of its own, so the first parameter is unused.
function ThreadFallback(_props: object, { retry }: ErrorInfo) {
  return (
    <div>
      <p>The conversation could not be loaded.</p>
      <button onClick={retry}>Try again</button>
    </div>
  )
}

export const ThreadErrorBoundary = catchError(ThreadFallback)

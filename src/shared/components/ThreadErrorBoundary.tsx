'use client'

import { catchError } from 'next/error'
import type { ErrorInfo } from 'next/error'

function ThreadFallback(_props: object, { retry }: ErrorInfo) {
  return (
    <div>
      <p>The conversation could not be loaded.</p>
      <button onClick={() => retry()}>Try again</button>
    </div>
  )
}

export const ThreadErrorBoundary = catchError(ThreadFallback)

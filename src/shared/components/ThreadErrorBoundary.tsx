'use client'

import { catchError } from 'next/error'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/lib/cn'
import type { ErrorInfo } from 'next/error'

// The fallback takes the boundary's own props first, then the error info.
// This one needs no props of its own, so the first parameter is unused.
function ThreadFallback(_props: object, { retry }: ErrorInfo) {
  return (
    <div
      className={cn(
        'flex flex-col items-start gap-3 rounded-(--border-radius) border border-slate-200 p-4 dark:border-slate-700'
      )}
    >
      <p className={cn('text-sm text-slate-600 dark:text-slate-300')}>The conversation could not be loaded.</p>
      <Button variant="ghost" size="sm" onClick={retry}>
        Try again
      </Button>
    </div>
  )
}

export const ThreadErrorBoundary = catchError(ThreadFallback)

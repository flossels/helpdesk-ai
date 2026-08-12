'use client'

import { Button } from '@/shared/components/ui/Button'
import { inter, poppins } from '@/shared/lib/fonts'
import { cn } from '@/shared/lib/cn'
import type { ErrorInfo } from 'next/error'

export default function GlobalError({ retry }: ErrorInfo) {
  return (
    <html lang="en" className={cn(inter.variable, poppins.variable)}>
      <body>
        <h1>Something went wrong</h1>
        <Button onClick={retry}>Try again</Button>
      </body>
    </html>
  )
}

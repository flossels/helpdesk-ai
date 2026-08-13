'use client'

import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/components/ui/Button'
import { useConsent } from '@/shared/lib/analytics/consent'

export function ConsentBanner() {
  const { status, grant, deny } = useConsent()
  if (status !== 'unset') return null

  return (
    <div
      data-consent-banner
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-4',
        'dark:border-slate-700 dark:bg-slate-900'
      )}
    >
      <div className={cn('mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between')}>
        <p className={cn('text-sm text-slate-600 dark:text-slate-300')}>
          We use privacy-friendly analytics to improve HelpDesk AI. You can decline without losing any functionality.
        </p>
        <div className={cn('flex shrink-0 gap-2')}>
          <Button variant="ghost" size="sm" onClick={deny}>
            Decline
          </Button>
          <Button size="sm" onClick={grant}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { Dialog as HuiDialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/components/ui/Button'
import type { ReactNode } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  animated?: boolean
  children: ReactNode
}

export function Dialog({ open, onClose, title, animated = true, children }: Props) {
  return (
    <HuiDialog open={open} onClose={onClose}>
      <DialogBackdrop
        transition={animated}
        className={cn('fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity', 'duration-200 data-closed:opacity-0')}
      />
      <div className={cn('fixed inset-0 z-50 w-screen overflow-y-auto')}>
        <div className={cn('flex min-h-full items-center justify-center p-4')}>
          <DialogPanel
            transition={animated}
            className={cn(
              'w-full max-w-md rounded-xl bg-white p-6 text-slate-900 shadow-xl transition-all duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 dark:bg-slate-800 dark:text-slate-100'
            )}
          >
            {title && (
              <DialogTitle as="h3" className={cn('text-base/7 font-medium')}>
                {title}
              </DialogTitle>
            )}
            <div className={cn('mt-2 text-sm/6')}>{children}</div>
            <div className={cn('mt-4')}>
              <Button autoFocus onClick={onClose}>
                Close
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </HuiDialog>
  )
}

'use client'

import type { ReactNode } from 'react'
import { Dialog as HuiDialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import cn from '@/shared/lib/cn'
import Button from '@/shared/components/ui/Button'

type Props = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

const Dialog = ({ isOpen, onClose, title, children }: Props) => {
  return (
    <HuiDialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
      <DialogBackdrop
        transition
        className={cn('fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200 data-closed:opacity-0')}
      />
      <div className={cn('fixed inset-0 z-10 w-screen overflow-y-auto')}>
        <div className={cn('flex min-h-full items-center justify-center p-4')}>
          <DialogPanel
            transition
            className={cn(
              'w-full max-w-md rounded-(--border-radius) bg-white p-6 shadow-xl transition-all duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0'
            )}
          >
            {title && (
              <DialogTitle as="h3" className={cn('text-base/7 font-medium')}>
                {title}
              </DialogTitle>
            )}
            <div className={cn('mt-2 text-sm/6')}>{children}</div>
            <div className={cn('mt-4')}>
              <Button onClick={onClose}>Close</Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </HuiDialog>
  )
}

export default Dialog

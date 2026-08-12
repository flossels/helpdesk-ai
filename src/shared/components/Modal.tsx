'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function Modal({ children }: Props) {
  const router = useRouter()

  return (
    <div onClick={() => router.back()} className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white p-6">
        {children}
      </div>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const Modal = ({ children }: Props) => {
  const router = useRouter()

  return (
    <div onClick={() => router.back()} role="dialog" aria-modal="true">
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}

export default Modal

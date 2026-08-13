'use client'

import { useState } from 'react'
import { cn } from '@/shared/lib/cn'

type Props = {
  onSend: (text: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, disabled = false, placeholder }: Props) {
  const [value, setValue] = useState('')

  function submit() {
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue('')
  }

  return (
    <textarea
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          submit()
        }
      }}
      disabled={disabled}
      rows={2}
      placeholder={placeholder ?? 'Ask anything…'}
      className={cn('w-full resize-none border-t px-3 py-2 text-sm focus:outline-none')}
    />
  )
}

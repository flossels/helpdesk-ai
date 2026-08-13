'use client'

import dynamic from 'next/dynamic'
import { cn } from '@/shared/lib/cn'
import type { JSONContent } from '@tiptap/react'

type RichTextEditorProps = {
  value: JSONContent
  onChange: (value: JSONContent, text: string) => void
  placeholder?: string
  label?: string
}

const RichTextEditor = dynamic(() => import('@/shared/components/ui/RichTextEditor').then((mod) => mod.RichTextEditor), {
  loading: () => <div className={cn('h-40 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800')} />,
  ssr: false
})

export function RichTextEditorLazy(props: RichTextEditorProps) {
  return <RichTextEditor {...props} />
}

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { cn } from '@/shared/lib/cn'
import { RichTextToolbar } from '@/shared/components/ui/RichTextToolbar'
import type { JSONContent } from '@tiptap/react'

type Props = {
  value: JSONContent
  onChange: (value: JSONContent, text: string) => void
  placeholder?: string
  label?: string
}

const contentClasses = cn(
  'rounded-lg border border-slate-300 bg-white',
  'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500',
  'dark:border-slate-600 dark:bg-slate-800',
  '[&_.ProseMirror]:min-h-32 [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2',
  '[&_.ProseMirror]:text-sm [&_.ProseMirror]:text-slate-900 [&_.ProseMirror]:outline-none',
  'dark:[&_.ProseMirror]:text-slate-100',
  '[&_.ProseMirror_strong]:font-semibold',
  '[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5',
  '[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5',
  '[&_.ProseMirror_a]:text-blue-600 [&_.ProseMirror_a]:underline',
  '[&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-slate-100 [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:text-xs dark:[&_.ProseMirror_code]:bg-slate-700',
  '[&_.ProseMirror_pre]:rounded-md [&_.ProseMirror_pre]:bg-slate-900 [&_.ProseMirror_pre]:px-3 [&_.ProseMirror_pre]:py-2 [&_.ProseMirror_pre]:text-slate-100',
  '[&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left [&_.ProseMirror_p.is-editor-empty:first-child]:before:h-0 [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-slate-400 [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]'
)

export function RichTextEditor({ value, onChange, placeholder, label }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      Placeholder.configure({ placeholder: placeholder ?? '' })
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': label ?? placeholder ?? 'Rich text'
      }
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON(), editor.getText())
  })

  return (
    <div className={cn('space-y-2')}>
      <RichTextToolbar editor={editor} />
      <EditorContent editor={editor} className={contentClasses} />
    </div>
  )
}

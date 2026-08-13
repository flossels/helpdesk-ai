'use client'

import { cn } from '@/shared/lib/cn'
import type { Editor } from '@tiptap/react'

type Props = {
  editor: Editor | null
}

const toolbarClasses = cn(
  'flex flex-wrap items-center gap-1 rounded-lg border p-1',
  'border-slate-300 bg-slate-50',
  'dark:border-slate-600 dark:bg-slate-800'
)

const dividerClasses = cn('mx-1 h-5 w-px bg-slate-300 dark:bg-slate-600')

const buttonClasses = (active: boolean) =>
  cn(
    'rounded px-2 py-1 text-sm font-medium transition-colors',
    active ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
  )

export function RichTextToolbar({ editor }: Props) {
  if (!editor) return null

  const toggleLink = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
      return
    }
    const url = window.prompt('Enter URL')
    if (url && /^https?:\/\//i.test(url)) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div role="toolbar" aria-label="Formatting" className={toolbarClasses}>
      <button
        type="button"
        aria-pressed={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClasses(editor.isActive('bold'))}
      >
        Bold
      </button>
      <button
        type="button"
        aria-pressed={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClasses(editor.isActive('italic'))}
      >
        Italic
      </button>
      <button
        type="button"
        aria-pressed={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClasses(editor.isActive('strike'))}
      >
        Strike
      </button>
      <button
        type="button"
        aria-pressed={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={buttonClasses(editor.isActive('code'))}
      >
        Code
      </button>

      <span className={dividerClasses} aria-hidden="true" />

      <button
        type="button"
        aria-pressed={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClasses(editor.isActive('bulletList'))}
      >
        List
      </button>
      <button
        type="button"
        aria-pressed={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClasses(editor.isActive('orderedList'))}
      >
        Ordered
      </button>
      <button
        type="button"
        aria-pressed={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={buttonClasses(editor.isActive('codeBlock'))}
      >
        Code Block
      </button>

      <span className={dividerClasses} aria-hidden="true" />

      <button
        type="button"
        aria-pressed={editor.isActive('link')}
        onClick={toggleLink}
        className={buttonClasses(editor.isActive('link'))}
      >
        Link
      </button>
    </div>
  )
}

'use client'

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { ComponentProps } from 'react'

type Props = {
  children: string
}

function Code({ className, children }: ComponentProps<'code'>) {
  const match = /language-(\w+)/.exec(className ?? '')
  if (!match) return <code className={className}>{children}</code>

  return (
    <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div">
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  )
}

export function Markdown({ children }: Props) {
  return <ReactMarkdown components={{ code: Code }}>{children}</ReactMarkdown>
}

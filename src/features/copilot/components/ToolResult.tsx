'use client'

import { cn } from '@/shared/lib/cn'

type Props = {
  name: string
  output: unknown
}

export function ToolResult({ name, output }: Props) {
  const rows = Array.isArray(output) ? output : null
  const draft = typeof output === 'object' && output !== null && 'draft' in output ? String(output.draft) : null

  return (
    <div className={cn('rounded-md border border-slate-200 p-2 text-sm dark:border-slate-700')}>
      <p className={cn('mb-1 font-medium text-slate-500')}>{name}</p>
      {draft && <p className={cn('whitespace-pre-wrap')}>{draft}</p>}
      {rows && rows.length === 0 && <p className={cn('text-slate-500')}>No matches.</p>}
      {rows && rows.length > 0 && (
        <ul className={cn('space-y-0.5')}>
          {rows.map((row, index) => (
            <li key={index} className={cn('truncate')}>
              {typeof row === 'object' && row !== null && 'subject' in row
                ? `${String(row.trackingId ?? '')} ${String(row.subject)}`
                : JSON.stringify(row)}
            </li>
          ))}
        </ul>
      )}
      {!draft && !rows && <pre className={cn('overflow-x-auto text-xs')}>{JSON.stringify(output, null, 2)}</pre>}
    </div>
  )
}

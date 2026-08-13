import { PaperClipIcon } from '@heroicons/react/24/outline'
import { cn } from '@/shared/lib/cn'

type Attachment = {
  id: string
  fileName: string
  fileType: string
  fileSize: number
}

type Props = {
  attachments: Attachment[]
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AttachmentList({ attachments }: Props) {
  if (attachments.length === 0) return null

  return (
    <ul className={cn('space-y-1')}>
      {attachments.map((attachment) => (
        <li key={attachment.id}>
          <a
            href={`/api/uploads/${attachment.id}`}
            className={cn(
              'inline-flex items-center gap-2 rounded px-2 py-1 text-sm',
              'text-blue-600 hover:bg-slate-100 hover:underline',
              'dark:text-blue-400 dark:hover:bg-slate-800'
            )}
          >
            <PaperClipIcon className={cn('size-4 shrink-0')} aria-hidden="true" />
            <span>{attachment.fileName}</span>
            <span className={cn('text-xs text-slate-500')}>{formatSize(attachment.fileSize)}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

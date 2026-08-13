import { cn } from '@/shared/lib/cn'
import { Link } from '@/i18n/navigation'

export default function Forbidden() {
  return (
    <main className={cn('flex min-h-[70vh] flex-col items-center justify-center gap-3 p-6 text-center')}>
      <p className={cn('text-sm font-semibold text-blue-600 dark:text-blue-400')}>403</p>
      <h1 className={cn('text-2xl font-bold text-slate-900 dark:text-slate-100')}>No access</h1>
      <p className={cn('max-w-md text-sm text-slate-600 dark:text-slate-400')}>
        Your account doesn&apos;t have permission to view this page.
      </p>
      <Link
        href="/"
        className={cn(
          'mt-2 inline-flex items-center rounded-(--border-radius) bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
        )}
      >
        Back to startpage
      </Link>
    </main>
  )
}

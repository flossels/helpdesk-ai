import { Card } from '@/shared/components/ui/Card'
import { cn } from '@/shared/lib/cn'

export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div
      className={cn(
        'flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 to-slate-200 p-4 dark:from-slate-900 dark:to-slate-800'
      )}
    >
      <main className={cn('w-full max-w-md')}>
        <Card>{children}</Card>
      </main>
    </div>
  )
}

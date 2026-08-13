import { Suspense } from 'react'
import Link from 'next/link'
import { cn } from '@/shared/lib/cn'
import { Logo } from '@/shared/components/Logo'
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle'
import { HeaderAuth } from '@/features/auth/components/HeaderAuth'

// Read once at module scope. Inside the component this would be an unstable
// value during prerendering, which the build rejects from Chapter 7 on.
const currentYear = new Date().getFullYear()

export default function PublicLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className={cn('flex min-h-screen flex-col')}>
      <header className={cn('border-b border-slate-200 dark:border-slate-700')}>
        <nav className={cn('mx-auto flex max-w-5xl items-center justify-between p-4')}>
          <Link href="/">
            <Logo />
          </Link>
          <div className={cn('flex items-center gap-6 text-sm')}>
            <Link href="/about" className={cn('text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white')}>
              About
            </Link>
            <Link href="/submit" className={cn('text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white')}>
              Submit a Ticket
            </Link>
            <Suspense fallback={null}>
              <HeaderAuth />
            </Suspense>
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <main className={cn('mx-auto w-full max-w-5xl grow p-4')}>
        <Suspense fallback={null}>{children}</Suspense>
      </main>
      <footer className={cn('border-t border-slate-200 dark:border-slate-700')}>
        <div className={cn('mx-auto flex max-w-5xl flex-col gap-2 p-4 text-sm text-slate-500', 'sm:flex-row sm:justify-between')}>
          <p>&copy; {currentYear} HelpDesk AI</p>
          <Link href="/about" className={cn('hover:text-slate-900 dark:hover:text-white')}>
            About
          </Link>
        </div>
      </footer>
    </div>
  )
}

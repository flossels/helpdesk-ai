import { Suspense } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { cn } from '@/shared/lib/cn'
import { Logo } from '@/shared/components/Logo'
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle'
import { HeaderAuth } from '@/features/auth/components/HeaderAuth'
import { PublicNav } from '@/features/i18n/components/PublicNav'
import { Link } from '@/i18n/navigation'

// Read once at module scope. Inside the component this would be an unstable
// value during prerendering, which the build rejects from Chapter 7 on.
const currentYear = new Date().getFullYear()

export default async function PublicLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('footer')
  const tNav = await getTranslations('nav')

  return (
    <div className={cn('flex min-h-screen flex-col')}>
      <header className={cn('border-b border-slate-200 dark:border-slate-700')}>
        <nav className={cn('mx-auto flex max-w-5xl items-center justify-between p-4')}>
          <Link href="/">
            <Logo />
          </Link>
          <div className={cn('flex items-center gap-6 text-sm')}>
            <Suspense fallback={null}>
              <PublicNav />
            </Suspense>
            <Suspense fallback={null}>
              <HeaderAuth />
            </Suspense>
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <main id="main-content" className={cn('mx-auto w-full max-w-5xl grow p-4')}>
        <Suspense fallback={null}>{children}</Suspense>
      </main>
      <footer className={cn('border-t border-slate-200 dark:border-slate-700')}>
        <div className={cn('mx-auto flex max-w-5xl flex-col gap-2 p-4 text-sm text-slate-500', 'sm:flex-row sm:justify-between')}>
          <p>{t('copyright', { year: String(currentYear), appName: 'HelpDesk AI' })}</p>
          <Link href="/about" className={cn('hover:text-slate-900 dark:hover:text-white')}>
            {tNav('about')}
          </Link>
        </div>
      </footer>
    </div>
  )
}

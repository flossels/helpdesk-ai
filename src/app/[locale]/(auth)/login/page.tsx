import { Suspense } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { cn } from '@/shared/lib/cn'
import { Link } from '@/i18n/navigation'
import { CredentialsForm } from '@/features/auth/components/CredentialsForm'
import { SignInButton } from '@/features/auth/components/SignInButton'

export default async function LoginPage({ params }: PageProps<'/[locale]/login'>) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('pages')

  return (
    <div className={cn('space-y-6')}>
      <h1 className={cn('text-center text-xl font-semibold text-slate-900 dark:text-slate-100')}>{t('signInTitle')}</h1>
      <Suspense fallback={null}>
        <CredentialsForm />
        <div className={cn('flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400')}>
          <span className={cn('h-px flex-1 bg-slate-200 dark:bg-slate-700')} />
          {t('or')}
          <span className={cn('h-px flex-1 bg-slate-200 dark:bg-slate-700')} />
        </div>
        <SignInButton />
      </Suspense>
      <Suspense fallback={null}>
        <p className={cn('text-center text-sm text-slate-500 dark:text-slate-400')}>
          {t('noAccount')}{' '}
          <Link href="/signup" className={cn('font-medium text-blue-600 hover:text-blue-500')}>
            {t('createOne')}
          </Link>
        </p>
      </Suspense>
    </div>
  )
}

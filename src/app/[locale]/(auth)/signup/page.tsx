import { Suspense } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { cn } from '@/shared/lib/cn'
import { Link } from '@/i18n/navigation'
import { SignUpForm } from '@/features/auth/components/SignUpForm'

export default async function SignUpPage({ params }: PageProps<'/[locale]/signup'>) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('pages')

  return (
    <div className={cn('space-y-6')}>
      <h1 className={cn('text-center text-xl font-semibold text-slate-900 dark:text-slate-100')}>{t('signUpTitle')}</h1>
      <SignUpForm />
      <Suspense fallback={null}>
        <p className={cn('text-center text-sm text-slate-500 dark:text-slate-400')}>
          {t('haveAccount')}{' '}
          <Link href="/login" className={cn('font-medium text-blue-600 hover:text-blue-500')}>
            {t('signIn')}
          </Link>
        </p>
      </Suspense>
    </div>
  )
}

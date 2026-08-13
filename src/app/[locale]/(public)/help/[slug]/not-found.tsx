import { locale } from 'next/root-params'
import { getTranslations } from 'next-intl/server'
import { cn } from '@/shared/lib/cn'
import { Link } from '@/i18n/navigation'

export default async function ArticleNotFound() {
  const currentLocale = await locale()
  const t = await getTranslations({ locale: currentLocale, namespace: 'helpCenter' })

  return (
    <div className={cn('space-y-4')}>
      <h1 className={cn('text-2xl font-semibold text-slate-900 dark:text-slate-100')}>{t('notFoundTitle')}</h1>
      <p className={cn('text-slate-600 dark:text-slate-300')}>{t('notFoundBody')}</p>
      <Link href="/" className={cn('font-medium text-blue-600 hover:text-blue-500')}>
        {t('backHome')}
      </Link>
    </div>
  )
}

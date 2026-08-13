'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/cn'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from '@/features/i18n/components/LanguageSwitcher'

export function PublicNav() {
  const t = useTranslations('nav')

  return (
    <>
      <Link href="/about" className={cn('text-slate-600 hover:text-slate-900 dark:text-slate-300')}>
        {t('about')}
      </Link>
      <Link href="/submit" className={cn('text-slate-600 hover:text-slate-900 dark:text-slate-300')}>
        {t('submit')}
      </Link>
      <LanguageSwitcher />
    </>
  )
}

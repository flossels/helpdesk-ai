import { getTranslations } from 'next-intl/server'
import { cn } from '@/shared/lib/cn'
import { Link } from '@/i18n/navigation'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { SignOutButton } from '@/features/auth/components/SignOutButton'

export async function HeaderAuth() {
  const t = await getTranslations('nav')
  const user = await getCurrentUser()

  if (user) {
    return <SignOutButton redirectTo="/" label={t('logOut')} />
  }

  return (
    <Link
      href="/login"
      className={cn('rounded-(--border-radius) bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-500')}
    >
      {t('logIn')}
    </Link>
  )
}

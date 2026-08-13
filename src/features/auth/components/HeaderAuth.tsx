import Link from 'next/link'
import { cn } from '@/shared/lib/cn'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { SignOutButton } from '@/features/auth/components/SignOutButton'

export async function HeaderAuth() {
  const user = await getCurrentUser()

  if (user) {
    return <SignOutButton redirectTo="/" />
  }

  return (
    <Link
      href="/login"
      className={cn('rounded-(--border-radius) bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-500')}
    >
      Log in
    </Link>
  )
}

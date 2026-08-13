import { Suspense } from 'react'
import Link from 'next/link'
import { cn } from '@/shared/lib/cn'
import { CredentialsForm } from '@/features/auth/components/CredentialsForm'
import { SignInButton } from '@/features/auth/components/SignInButton'

export default function LoginPage() {
  return (
    <div className={cn('space-y-6')}>
      <h1 className={cn('text-center text-xl font-semibold text-slate-900 dark:text-slate-100')}>Sign in to HelpDesk AI</h1>
      <Suspense fallback={null}>
        <CredentialsForm />
        <div className={cn('flex items-center gap-3 text-xs text-slate-400')}>
          <span className={cn('h-px flex-1 bg-slate-200 dark:bg-slate-700')} />
          or
          <span className={cn('h-px flex-1 bg-slate-200 dark:bg-slate-700')} />
        </div>
        <SignInButton />
      </Suspense>
      <p className={cn('text-center text-sm text-slate-500 dark:text-slate-400')}>
        Don&apos;t have an account?{' '}
        <Link href="/signup" className={cn('font-medium text-blue-600 hover:text-blue-500')}>
          Create one
        </Link>
      </p>
    </div>
  )
}

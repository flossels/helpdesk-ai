import Link from 'next/link'
import { cn } from '@/shared/lib/cn'
import { SignUpForm } from '@/features/auth/components/SignUpForm'

export default function SignUpPage() {
  return (
    <div className={cn('space-y-6')}>
      <h1 className={cn('text-center text-xl font-semibold text-slate-900 dark:text-slate-100')}>
        Create your HelpDesk AI account
      </h1>
      <SignUpForm />
      <p className={cn('text-center text-sm text-slate-500 dark:text-slate-400')}>
        Already have an account?{' '}
        <Link href="/login" className={cn('font-medium text-blue-600 hover:text-blue-500')}>
          Sign in
        </Link>
      </p>
    </div>
  )
}

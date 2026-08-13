'use client'

import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/shared/components/ui/Button'

export function SignInButton() {
  const next = useSearchParams().get('next')
  return (
    <Button variant="secondary" className="w-full" onClick={() => signIn('google', { redirectTo: next ?? '/tickets' })}>
      Continue with Google
    </Button>
  )
}

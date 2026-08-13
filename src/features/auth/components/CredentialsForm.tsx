'use client'

import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'

export function CredentialsForm() {
  const next = useSearchParams().get('next')

  return (
    <form
      className="space-y-3"
      action={(formData) =>
        signIn('credentials', {
          email: formData.get('email'),
          password: formData.get('password'),
          redirectTo: next ?? '/tickets'
        })
      }
    >
      <Input type="email" name="email" required placeholder="you@example.com" />
      <Input type="password" name="password" required placeholder="Password" />
      <Button type="submit" className="w-full">
        Sign in with email
      </Button>
    </form>
  )
}

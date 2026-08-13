'use client'

import { Button } from '@/shared/components/ui/Button'

type Props = {
  label: string
  pendingLabel: string
  pending: boolean
}

export function SubmitButton({ label, pendingLabel, pending }: Props) {
  return (
    <Button type="submit" isLoading={pending} disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  )
}

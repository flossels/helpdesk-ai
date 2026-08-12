'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/shared/components/ui/Button'

type Props = {
  label: string
  pendingLabel: string
}

export function SubmitButton({ label, pendingLabel }: Props) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" isLoading={pending}>
      {pending ? pendingLabel : label}
    </Button>
  )
}

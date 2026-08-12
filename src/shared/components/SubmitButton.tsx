'use client'

import { useFormStatus } from 'react-dom'

type Props = {
  label: string
  pendingLabel: string
}

export function SubmitButton({ label, pendingLabel }: Props) {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  )
}

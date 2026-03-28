import { useFormStatus } from 'react-dom'

type Props = {
  label: string
}

export function SubmitButton({ label }: Props) {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : label}
    </button>
  )
}
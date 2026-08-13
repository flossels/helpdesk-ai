import { Button } from '@/shared/components/ui/Button'
import { signOutAction } from '@/features/auth/actions/signOut'

type Props = {
  redirectTo?: string
  label?: string
}

export function SignOutButton({ redirectTo = '/login', label = 'Log out' }: Props) {
  return (
    <form action={signOutAction.bind(null, redirectTo)}>
      <Button type="submit" variant="secondary" className="w-full">
        {label}
      </Button>
    </form>
  )
}

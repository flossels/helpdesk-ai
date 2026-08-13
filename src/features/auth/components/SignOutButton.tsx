import { Button } from '@/shared/components/ui/Button'
import { signOutAction } from '@/features/auth/actions/signOut'

type Props = {
  redirectTo?: string
}

export function SignOutButton({ redirectTo = '/login' }: Props) {
  return (
    <form action={signOutAction.bind(null, redirectTo)}>
      <Button type="submit" variant="secondary" className="w-full">
        Log out
      </Button>
    </form>
  )
}

import { NavLink } from '@/app/(dashboard)/_components/NavLink'

export default function SettingsLayout({ children }: LayoutProps<'/settings'>) {
  return (
    <div>
      <nav className="mb-4 flex gap-4 border-b p-2 pb-4">
        <NavLink href="/settings">General</NavLink>
        <NavLink href="/settings/members">Members</NavLink>
        <NavLink href="/settings/webhooks">Webhooks</NavLink>
      </nav>
      <div>{children}</div>
    </div>
  )
}

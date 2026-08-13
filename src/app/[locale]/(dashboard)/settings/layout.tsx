import { NavLink } from '@/app/[locale]/(dashboard)/_components/NavLink'

export default function SettingsLayout({ children }: LayoutProps<'/[locale]/settings'>) {
  return (
    <div>
      <nav className="mb-4 flex gap-4 border-b p-2 pb-4">
        <NavLink href="/settings">General</NavLink>
        <NavLink href="/settings/members">Members</NavLink>
        <NavLink href="/settings/webhooks">Webhooks</NavLink>
        <NavLink href="/settings/ai">AI</NavLink>
        <NavLink href="/settings/api-keys">API Keys</NavLink>
      </nav>
      <div>{children}</div>
    </div>
  )
}

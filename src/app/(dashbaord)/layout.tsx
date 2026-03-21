import SidebarNav from '@/shared/components/SidebarNav'

export default function DashboardLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex gap-6">
      <aside className="border-r pr-4">
        <SidebarNav />
      </aside>
      <div>
        <header>Dashboard Header</header>
        <main>{children}</main>
      </div>
    </div>
  )
}

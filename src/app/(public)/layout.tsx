export default function PublicLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex flex-col gap-6">
      <header className="border-b pb-2">
        <nav>
          <span>HelpDesk AI</span>
        </nav>
      </header>
      <main className="flex flex-grow py-6">{children}</main>
      <footer className="border-t pt-2">
        <p>&copy; 2026 HelpDesk AI</p>
      </footer>
    </div>
  )
}

// Read once at module scope. Inside the component this would be an unstable
// value during prerendering, which the build rejects from Chapter 7 on.
const currentYear = new Date().getFullYear()

export default function PublicLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex flex-col gap-6">
      <header className="border-b pb-2">
        <nav>
          <span>HelpDesk AI</span>
        </nav>
      </header>
      <main className="flex grow py-6">{children}</main>
      <footer className="border-t pt-2">
        <p>&copy; {currentYear} HelpDesk AI</p>
      </footer>
    </div>
  )
}

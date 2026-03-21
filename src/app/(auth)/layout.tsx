export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div>
      <main className="flex place-content-center items-center">{children}</main>
    </div>
  )
}

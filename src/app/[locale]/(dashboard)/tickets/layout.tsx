export default function TicketsLayout({ children, modal }: LayoutProps<'/[locale]/tickets'>) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}

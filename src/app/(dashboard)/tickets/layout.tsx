export default function TicketsLayout({ children, modal }: LayoutProps<'/tickets'>) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}

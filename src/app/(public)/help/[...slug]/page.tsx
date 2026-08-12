export async function generateStaticParams() {
  return [{ slug: ['getting-started'] }, { slug: ['billing', 'refunds'] }, { slug: ['authentication', 'reset-password'] }]
}

export default async function HelpPage({ params }: PageProps<'/help/[...slug]'>) {
  const { slug } = await params

  return (
    <div>
      <h1>Help: {slug.join(' / ')}</h1>
    </div>
  )
}

export async function generateStaticParams() {
  // In Chapter 8, we'll fetch these from the database
  return [{ slug: ['getting-started'] }, { slug: ['billing', 'refunds'] }, { slug: ['authentication', 'reset-password'] }]
}

export default async function HelpPage({ params }: PageProps<'/help/[...slug]'>) {
  const { slug } = await params
  // /help/billing/refunds → slug = ['billing', 'refunds']

  return (
    <div>
      <h1>Help: {slug.join(' / ')}</h1>
    </div>
  )
}

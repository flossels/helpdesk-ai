type Props = {
  article: { title: string; excerpt: string | null; updatedAt: Date }
  url: string
}

export function ArticleJsonLd({ article, url }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt ?? undefined,
    dateModified: article.updatedAt.toISOString(),
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: 'HelpDesk AI' }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
      }}
    />
  )
}

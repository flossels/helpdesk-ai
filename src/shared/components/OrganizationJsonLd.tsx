type Props = {
  url: string
}

export function OrganizationJsonLd({ url }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HelpDesk AI',
    url,
    logo: `${url}/icon`
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

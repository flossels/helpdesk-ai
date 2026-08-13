import { getTranslations, setRequestLocale } from 'next-intl/server'

export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('pages')

  return <h1>{t('aboutTitle')}</h1>
}

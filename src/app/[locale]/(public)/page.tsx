import { locale } from 'next/root-params'
import { cacheLife } from 'next/cache'
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  'use cache'
  cacheLife('max')

  const t = await getTranslations({ locale: await locale(), namespace: 'pages' })

  return <h1>{t('homeTitle')}</h1>
}

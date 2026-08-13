import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PublicTicketForm } from '@/features/tickets/components/PublicTicketForm'
import { getCategories } from '@/features/tickets/queries/getCategories'
import { getPublicOrganizationId } from '@/features/tickets/queries/getPublicOrganizationId'

export default async function SubmitPage({ params }: PageProps<'/[locale]/submit'>) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('ticketForm')

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <Suspense fallback={<p>{t('loadingForm')}</p>}>
        <SubmitForm />
      </Suspense>
    </div>
  )
}

async function SubmitForm() {
  const organizationId = await getPublicOrganizationId()
  if (!organizationId) notFound()

  const categories = await getCategories(organizationId)

  return <PublicTicketForm categories={categories} />
}

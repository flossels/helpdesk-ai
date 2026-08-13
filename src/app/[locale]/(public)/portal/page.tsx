import { Suspense } from 'react'
import { unauthorized } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { cn } from '@/shared/lib/cn'
import { Link } from '@/i18n/navigation'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getCustomerTickets } from '@/features/tickets/queries/getCustomerTickets'
import { CustomerTicketList } from '@/features/tickets/components/CustomerTicketList'
import { TicketListSkeleton } from '@/features/tickets/components/TicketListSkeleton'

export default async function PortalPage({ params }: PageProps<'/[locale]/portal'>) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('portal')

  return (
    <div className={cn('space-y-6')}>
      <div className={cn('flex items-center justify-between')}>
        <h1>{t('title')}</h1>
        <Suspense fallback={null}>
          <Link
            href="/submit"
            className={cn('rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700')}
          >
            {t('newTicket')}
          </Link>
        </Suspense>
      </div>
      <Suspense fallback={<TicketListSkeleton />}>
        <PortalTickets />
      </Suspense>
    </div>
  )
}

async function PortalTickets() {
  const user = await getCurrentUser()
  if (!user) unauthorized()

  const tickets = await getCustomerTickets(user.id)

  return <CustomerTicketList tickets={tickets} />
}

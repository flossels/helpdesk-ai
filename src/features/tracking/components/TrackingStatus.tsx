import { cacheLife, cacheTag } from 'next/cache'
import { locale } from 'next/root-params'
import { getFormatter, getTranslations } from 'next-intl/server'
import { getTicketByTrackingId } from '@/features/tickets/queries/getTicketByTrackingId'
import type { TicketStatus } from '@/shared/types/ticket'

type Props = Pick<PageProps<'/[locale]/track/[trackingId]'>, 'params'>

export async function TrackingStatus({ params }: Props) {
  const { trackingId } = await params

  return <TrackingCard trackingId={trackingId} />
}

async function TrackingCard({ trackingId }: { trackingId: string }) {
  'use cache'
  cacheLife('seconds')
  cacheTag(`tracking-${trackingId}`)

  const currentLocale = await locale()
  const t = await getTranslations({ locale: currentLocale, namespace: 'ticketStatus' })
  const format = await getFormatter({ locale: currentLocale })

  const ticket = await getTicketByTrackingId(trackingId)
  if (!ticket) return <p>{t('notFound')}</p>

  return (
    <div>
      <h2>{ticket.subject}</h2>
      <p>
        {t('status')}: {t(ticket.status as TicketStatus)}
      </p>
      <p>{t('lastUpdate', { date: format.dateTime(ticket.updatedAt, { dateStyle: 'medium' }) })}</p>
    </div>
  )
}

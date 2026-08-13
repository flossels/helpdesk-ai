import { Card } from '@/shared/components/ui/Card'
import { CardHeader } from '@/shared/components/ui/CardHeader'
import { CardBody } from '@/shared/components/ui/CardBody'
import { cn } from '@/shared/lib/cn'
import { getTicketSummary } from '@/features/tickets/queries/getTicketSummary'

export async function TicketSummary() {
  const summary = await getTicketSummary()

  return (
    <Card>
      <CardHeader>
        <h2 className={cn('text-sm font-semibold text-slate-900 dark:text-slate-100')}>AI Summary</h2>
      </CardHeader>
      <CardBody>
        <p className={cn('text-sm text-slate-600 dark:text-slate-300')}>{summary}</p>
      </CardBody>
    </Card>
  )
}

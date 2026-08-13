import 'server-only'

import { getTranslations } from 'next-intl/server'
import { sendEmail } from '@/shared/lib/sendEmail'
import type { ReactElement } from 'react'

type EmailTranslator = Awaited<ReturnType<typeof getTranslations<'emails'>>>

type EmailSubjectKey = 'ticketCreatedSubject' | 'agentReplySubject' | 'ticketResolvedSubject'

type SendLocalizedEmailInput = {
  to: string
  locale: string
  subjectKey: EmailSubjectKey
  trackingId: string
  template: (t: EmailTranslator) => ReactElement
}

export async function sendLocalizedEmail({ to, locale, subjectKey, trackingId, template }: SendLocalizedEmailInput) {
  const t = await getTranslations({ locale, namespace: 'emails' })

  await sendEmail({ to, subject: t(subjectKey, { trackingId }), template: template(t) })
}

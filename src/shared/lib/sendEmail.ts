import 'server-only'
import { render } from 'react-email'
import { SendEmailCommand } from '@aws-sdk/client-sesv2'
import { ses } from '@/shared/lib/ses'
import type { ReactElement } from 'react'

type SendEmailInput = { to: string; subject: string; template: ReactElement }

const overrideTo = process.env.EMAIL_OVERRIDE_TO

export async function sendEmail({ to, subject, template }: SendEmailInput) {
  const html = await render(template)

  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: process.env.AWS_SES_FROM_ADDRESS,
      Destination: { ToAddresses: [overrideTo || to] },
      Content: {
        Simple: {
          Subject: { Data: overrideTo ? `[${to}] ${subject}` : subject },
          Body: { Html: { Data: html } }
        }
      }
    })
  )
}

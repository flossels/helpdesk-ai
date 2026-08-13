import { config } from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

config({ path: '.env.local' })

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})
const db = new PrismaClient({ adapter })

function doc(text: string) {
  return { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] }
}

async function main() {
  // Clear in reverse dependency order
  await db.activityLog.deleteMany()
  await db.ticketReply.deleteMany()
  await db.ticket.deleteMany()
  await db.orgMember.deleteMany()
  await db.user.deleteMany()
  await db.organization.deleteMany()

  const org = await db.organization.create({
    data: { name: 'Acme Support', aiModel: 'openai/gpt-5.6-terra' }
  })

  const owner = await db.user.create({
    data: {
      name: 'Dana Ortiz',
      email: 'dana@acme.test',
      password: await hash('Start2026!', 10),
      role: 'AGENT'
    }
  })

  await db.orgMember.create({
    data: {
      userId: owner.id,
      organizationId: org.id,
      role: 'OWNER'
    }
  })

  const agent = await db.user.create({
    data: {
      name: 'Priya Raman',
      email: 'priya@acme.test',
      password: await hash('Start2026!', 10),
      role: 'AGENT'
    }
  })

  const viewer = await db.user.create({
    data: {
      name: 'Tomas Ferreira',
      email: 'tomas@acme.test',
      password: await hash('Start2026!', 10),
      role: 'AGENT'
    }
  })

  await db.orgMember.createMany({
    data: [
      { userId: agent.id, organizationId: org.id, role: 'AGENT' },
      { userId: viewer.id, organizationId: org.id, role: 'VIEWER' }
    ]
  })

  const customer = await db.user.create({
    data: {
      name: 'Sam Rivera',
      email: 'sam@customer.test',
      password: await hash('Start2026!', 10),
      role: 'CUSTOMER'
    }
  })

  await db.category.createMany({
    data: [
      { name: 'Account & Login', color: '#6366f1', organizationId: org.id },
      { name: 'Billing', color: '#f59e0b', organizationId: org.id },
      { name: 'Technical Issue', color: '#10b981', organizationId: org.id }
    ]
  })
  const billing = await db.category.findFirstOrThrow({
    where: { organizationId: org.id, name: 'Billing' }
  })

  const overdue = await db.ticket.create({
    data: {
      trackingId: 'HD-0001',
      subject: 'Invoice for March is missing',
      description: 'My March invoice never showed up in the portal.',
      status: 'OPEN',
      priority: 'HIGH',
      categoryId: billing.id,
      customerId: customer.id,
      organizationId: org.id,
      // Deliberately in the past: the inbox needs one overdue row so the
      // breached-SLA state is visible while we build against the seed.
      slaDeadline: new Date('2026-05-02T11:00:00.000Z'),
      replies: {
        create: [
          {
            content: doc('Looking into this now.'),
            contentText: 'Looking into this now.',
            authorId: owner.id
          }
        ]
      }
    }
  })

  const accountLogin = await db.category.findFirstOrThrow({
    where: { organizationId: org.id, name: 'Account & Login' }
  })

  const resolvedTickets = [
    {
      trackingId: 'HD-0002',
      subject: 'Login recovery',
      description: 'I have not been able to sign in since Friday and the app keeps rejecting my credentials.',
      solution:
        'The account was locked after five failed sign-in attempts. Locks clear automatically after 30 minutes, or an agent can clear one from Settings, Members. Send a fresh reset link afterwards so the customer can set a new password.',
      status: 'RESOLVED'
    },
    {
      trackingId: 'HD-0003',
      subject: 'Cannot get back into my account',
      description: 'My password stopped working overnight and the reset page says my address is unknown.',
      solution:
        'The address on the account was the work alias, not the personal one the customer was typing. Look the user up by name under Settings, Members, confirm the primary address, and send the reset link to that address.',
      status: 'RESOLVED',
      customerLastWord: 'That was it, thank you. I am back in.'
    },
    {
      trackingId: 'HD-0004',
      subject: 'The reset mail never arrives',
      description: 'I have requested the password reset four times today and nothing reaches my inbox.',
      solution:
        'Reset mail was being held by the customer domain as bulk. Ask the customer to allow our sending domain, then resend. If a bounce is recorded under Settings, Email, the address itself is rejecting mail and needs correcting first.',
      status: 'RESOLVED'
    },
    {
      trackingId: 'HD-0005',
      subject: 'Credential restoration for a shared mailbox',
      description: 'The whole team lost access to the shared support mailbox after our SSO migration.',
      solution:
        'Shared mailboxes cannot own an SSO identity. Convert the mailbox to a group, give one named person ownership, and re-invite the rest as members. Their existing tickets follow the group and stay visible.',
      status: 'CLOSED'
    },
    {
      trackingId: 'HD-0006',
      subject: 'Access after reset',
      description: 'I set a new password but the app still signs me straight back out.',
      solution:
        'Old sessions survive a password change until they expire. Sign out of every device from Settings, Security, then sign in once with the new password. A stale service worker can also hold the old session, so a hard reload clears it.',
      status: 'RESOLVED'
    }
  ]

  for (const [index, ticket] of resolvedTickets.entries()) {
    const openedAt = new Date(`2026-05-${String(index + 4).padStart(2, '0')}T09:00:00.000Z`)
    const answeredAt = new Date(openedAt.getTime() + 90 * 60 * 1000)

    await db.ticket.create({
      data: {
        trackingId: ticket.trackingId,
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
        priority: 'MEDIUM',
        categoryId: accountLogin.id,
        customerId: customer.id,
        assigneeId: index % 2 === 0 ? owner.id : agent.id,
        organizationId: org.id,
        createdAt: openedAt,
        slaDeadline: new Date(openedAt.getTime() + 8 * 60 * 60 * 1000),
        resolvedAt: answeredAt,
        closedAt: ticket.status === 'CLOSED' ? answeredAt : null,
        closedById: ticket.status === 'CLOSED' ? owner.id : null,
        replies: {
          create: [
            {
              content: doc(ticket.solution),
              contentText: ticket.solution,
              authorId: owner.id,
              createdAt: answeredAt
            },
            ...(ticket.customerLastWord
              ? [
                  {
                    content: doc(ticket.customerLastWord),
                    contentText: ticket.customerLastWord,
                    authorId: customer.id,
                    createdAt: new Date(answeredAt.getTime() + 15 * 60 * 1000)
                  }
                ]
              : [])
          ]
        }
      }
    })
  }

  const technical = await db.category.findFirstOrThrow({
    where: { organizationId: org.id, name: 'Technical Issue' }
  })

  const inProgress = await db.ticket.create({
    data: {
      trackingId: 'HD-0007',
      subject: 'Attachments fail to upload over 5 MB',
      description: 'Every screenshot above roughly 5 MB stops at 90 percent and then errors.',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      categoryId: technical.id,
      customerId: customer.id,
      assigneeId: agent.id,
      organizationId: org.id,
      slaDeadline: new Date(Date.now() + 45 * 60 * 1000),
      replies: {
        create: [
          {
            content: doc('Reproduced on our side. Raising the limit on the upload endpoint now.'),
            contentText: 'Reproduced on our side. Raising the limit on the upload endpoint now.',
            authorId: agent.id
          }
        ]
      }
    }
  })

  await db.activityLog.createMany({
    data: [
      {
        organizationId: org.id,
        userId: agent.id,
        action: 'ticket.assigned',
        entityType: 'ticket',
        entityId: inProgress.id
      },
      {
        organizationId: org.id,
        userId: owner.id,
        action: 'ticket.status_changed',
        entityType: 'ticket',
        entityId: overdue.id
      }
    ]
  })

  await db.cannedResponse.createMany({
    data: [
      {
        title: 'Password reset link',
        content: doc('We have sent a fresh reset link to your address. It is valid for 60 minutes.'),
        organizationId: org.id
      },
      {
        title: 'Invoice copy on the way',
        content: doc('A copy of the invoice is attached. It is also available under Billing in the portal.'),
        organizationId: org.id
      },
      {
        title: 'Need more detail',
        content: doc(
          'Could you send a screenshot of the error and the time it happened? That usually points us straight at the cause.'
        ),
        organizationId: org.id
      }
    ]
  })
}

main()
  .then(() => db.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await db.$disconnect()
    process.exit(1)
  })

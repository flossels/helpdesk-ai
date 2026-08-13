import 'server-only'
import type { getTicketThread } from '@/features/tickets/queries/getTicketThread'

type TicketThread = NonNullable<Awaited<ReturnType<typeof getTicketThread>>>

const MAX_MESSAGES = 30

export function formatTicketThread(ticket: TicketThread): string {
  const header = [
    `Subject: ${ticket.subject}`,
    `Customer: ${ticket.customer.name}`,
    `Status: ${ticket.status}`,
    `Priority: ${ticket.priority}`,
    `Category: ${ticket.category.name}`,
    '',
    `Original request: ${ticket.description}`
  ].join('\n')

  const transcript = [
    ...ticket.replies.map((m) => ({ kind: 'reply' as const, ...m })),
    ...ticket.notes.map((m) => ({ kind: 'note' as const, ...m }))
  ]
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .slice(-MAX_MESSAGES)
    .map((m) =>
      m.kind === 'note' ? `[internal note · ${m.author.name}]: ${m.contentText}` : `${m.author.name}: ${m.contentText}`
    )
    .join('\n\n')

  return `${header}\n\n---\n\n${transcript}`
}

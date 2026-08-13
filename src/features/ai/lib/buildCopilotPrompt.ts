import 'server-only'

import { COPILOT_GENERAL_PROMPT, COPILOT_SECURITY_RULES, COPILOT_TICKET_PROMPT } from '@/features/ai/lib/prompts'
import { formatTicketThread } from '@/features/ai/lib/formatTicketThread'
import type { TicketThread } from '@/features/ai/lib/formatTicketThread'

export function buildCopilotPrompt(ticket: TicketThread | null): string {
  const base = ticket ? COPILOT_TICKET_PROMPT.replace('{ticketContext}', formatTicketThread(ticket)) : COPILOT_GENERAL_PROMPT

  return `${COPILOT_SECURITY_RULES}\n\n${base}`
}

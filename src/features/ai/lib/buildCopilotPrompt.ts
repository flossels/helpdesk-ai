import 'server-only'

import { COPILOT_GENERAL_PROMPT, COPILOT_TICKET_PROMPT } from '@/features/ai/lib/prompts'
import { formatTicketThread } from '@/features/ai/lib/formatTicketThread'
import type { TicketThread } from '@/features/ai/lib/formatTicketThread'

export function buildCopilotPrompt(ticket: TicketThread | null): string {
  if (!ticket) return COPILOT_GENERAL_PROMPT
  return COPILOT_TICKET_PROMPT.replace('{ticketContext}', formatTicketThread(ticket))
}

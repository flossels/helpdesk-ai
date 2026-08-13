import { flag } from 'flags/next'

export const aiCopilotEnabled = flag<boolean>({
  key: 'ai-copilot-enabled',
  description: 'Show the AI copilot panel on the ticket page',
  defaultValue: true,
  decide: () => true
})

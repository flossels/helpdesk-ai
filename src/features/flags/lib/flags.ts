import { flag } from 'flags/next'

// Each flag resolves at request time on the server. The decide function is
// where rollout logic lives: a percentage, an organization allowlist, a plan
// check. Here it defaults on, and the Vercel Toolbar can override the value
// in the current browser without a redeploy.
export const aiCopilotEnabled = flag<boolean>({
  key: 'ai-copilot-enabled',
  description: 'Show the AI copilot panel on the ticket page',
  defaultValue: true,
  decide: () => true
})

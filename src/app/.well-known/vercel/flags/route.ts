import { createFlagsDiscoveryEndpoint, getProviderData } from 'flags/next'
import * as flags from '@/features/flags/lib/flags'

// Publishes every exported flag so the Flags Explorer in the Vercel Toolbar
// can list and override them. The endpoint rejects any request that does not
// carry a token signed with FLAGS_SECRET.
export const GET = createFlagsDiscoveryEndpoint(() => getProviderData(flags))

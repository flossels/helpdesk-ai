import { createFlagsDiscoveryEndpoint, getProviderData } from 'flags/next'
import * as flags from '@/features/flags/lib/flags'

export const GET = createFlagsDiscoveryEndpoint(() => getProviderData(flags))

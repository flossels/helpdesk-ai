import { createMcpHandler, withMcpAuth } from 'mcp-handler'
import { registerTools } from '@/features/mcp/lib/registerTools'
import { verifyMcpToken } from '@/features/mcp/lib/verifyToken'

const handler = createMcpHandler(
  (server) => {
    registerTools(server)
  },
  { serverInfo: { name: 'HelpDesk AI', version: '1.0.0' } }
)

const authenticatedHandler = withMcpAuth(handler, verifyMcpToken, {
  required: true
})

export { authenticatedHandler as GET, authenticatedHandler as POST, authenticatedHandler as DELETE }

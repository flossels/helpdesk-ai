import 'server-only'

import { db } from '@/shared/lib/db'

const DEFAULT_CATEGORY_NAME = 'Uncategorized'
const DEFAULT_CATEGORY_COLOR = '#64748b'

function systemCustomerEmail(organizationId: string): string {
  return `mcp-system+${organizationId}@helpdesk.local`
}

export async function getSystemCustomerId(organizationId: string): Promise<string> {
  const email = systemCustomerEmail(organizationId)
  const customer = await db.user.upsert({
    where: { email },
    update: {},
    create: { email, name: 'MCP System', role: 'CUSTOMER' },
    select: { id: true }
  })
  return customer.id
}

export async function getDefaultCategoryId(organizationId: string): Promise<string> {
  const existing = await db.category.findFirst({
    where: { organizationId, name: DEFAULT_CATEGORY_NAME },
    select: { id: true }
  })
  if (existing) return existing.id

  const created = await db.category.create({
    data: { name: DEFAULT_CATEGORY_NAME, color: DEFAULT_CATEGORY_COLOR, organizationId },
    select: { id: true }
  })
  return created.id
}

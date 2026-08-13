'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { ActionResult } from '@/shared/types/actionResult'

const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Enter an organization name.').max(100)
})

type ReturnType = ActionResult<{ organizationId: string }>

export async function createOrganizationAction(_prevState: ReturnType | null, formData: FormData): Promise<ReturnType> {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Not authenticated.' }
    if (user.organizationId) {
      return { success: false, error: 'You already belong to an organization.' }
    }

    const parsed = createOrganizationSchema.safeParse({ name: formData.get('name') })
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    const organization = await db.organization.create({
      data: {
        name: parsed.data.name,
        members: { create: { userId: user.id, role: 'OWNER' } },
        categories: {
          create: [
            { name: 'Account & Login', color: '#6366f1' },
            { name: 'Billing', color: '#f59e0b' },
            { name: 'Technical Issue', color: '#10b981' }
          ]
        }
      },
      select: { id: true }
    })

    await db.user.update({ where: { id: user.id }, data: { role: 'AGENT' } })

    revalidatePath('/tickets')
    return { success: true, data: { organizationId: organization.id } }
  } catch (error) {
    console.error('Failed to create organization:', error)
    return { success: false, error: 'Could not create the organization.' }
  }
}

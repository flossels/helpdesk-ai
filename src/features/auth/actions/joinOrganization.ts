'use server'

import z from 'zod'
import { db } from '@/shared/lib/db'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { ActionResult } from '@/shared/types/actionResult'

const joinSchema = z.object({
  token: z.string().min(1, 'Enter your invite code.')
})

type ReturnType = ActionResult<{ organizationId: string }>

export async function joinOrganizationAction(_prevState: ReturnType | null, formData: FormData): Promise<ReturnType> {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Not authenticated.' }
    if (user.organizationId) {
      return { success: false, error: 'You already belong to an organization.' }
    }

    const parsed = joinSchema.safeParse({ token: formData.get('token') })
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    const invitation = await db.invitation.findUnique({
      where: { token: parsed.data.token },
      select: { id: true, email: true, organizationId: true, role: true, expiresAt: true }
    })
    const account = await db.user.findUnique({
      where: { id: user.id },
      select: { email: true }
    })

    if (!invitation || invitation.expiresAt < new Date() || invitation.email !== account?.email) {
      return { success: false, error: 'This invite is invalid or has expired.' }
    }

    await db.$transaction([
      db.orgMember.create({
        data: {
          userId: user.id,
          organizationId: invitation.organizationId,
          role: invitation.role
        }
      }),
      db.user.update({ where: { id: user.id }, data: { role: 'AGENT' } }),
      db.invitation.delete({ where: { id: invitation.id } })
    ])

    return { success: true, data: { organizationId: invitation.organizationId } }
  } catch (error) {
    console.error('Failed to join organization:', error)
    return { success: false, error: 'Could not join the organization.' }
  }
}

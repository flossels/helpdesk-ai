'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { hasScope } from '@/shared/lib/authorization'
import { invitationSchema } from '@/features/auth/schemas'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { ActionResult } from '@/shared/types/actionResult'
import type { InvitationInput } from '@/features/auth/schemas'

type ReturnType = ActionResult<{ token: string }>

export async function createInvitation(input: InvitationInput): Promise<ReturnType> {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Not authenticated.' }
    if (!user.organizationId || !hasScope(user.scopes, 'members:manage')) {
      return { success: false, error: 'Insufficient permissions.' }
    }

    const parsed = invitationSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    const invitation = await db.invitation.create({
      data: {
        email: parsed.data.email,
        role: parsed.data.role,
        organizationId: user.organizationId,
        token: crypto.randomUUID(),
        expiresAt
      },
      select: { token: true }
    })

    revalidatePath('/settings/members')
    return { success: true, data: { token: invitation.token } }
  } catch (error) {
    console.error('Failed to create invitation:', error)
    return { success: false, error: 'Could not create the invitation.' }
  }
}

'use server'

import { hash } from 'bcryptjs'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { signUpSchema } from '@/features/auth/schemas'
import { signIn } from '@/auth'
import type { ActionResult } from '@/shared/types/actionResult'
import type { SignUpInput } from '@/features/auth/schemas'

export async function signUp(input: SignUpInput): Promise<ActionResult<void>> {
  try {
    const parsed = signUpSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input.',
        fieldErrors: z.flattenError(parsed.error).fieldErrors
      }
    }

    const existing = await db.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true }
    })
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' }
    }

    await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: await hash(parsed.data.password, 10),
        role: 'CUSTOMER'
      }
    })

    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false
    })

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Sign-up failed:', error)
    return { success: false, error: 'Could not create the account.' }
  }
}

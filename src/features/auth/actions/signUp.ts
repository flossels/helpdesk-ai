'use server'

import { redirect } from 'next/navigation'
import { hash } from 'bcryptjs'
import z from 'zod'
import { db } from '@/shared/lib/db'
import { signIn } from '@/auth'
import type { ActionResult } from '@/shared/types/actionResult'

const signUpSchema = z.object({
  name: z.string().min(1, 'Please enter your name.'),
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.')
})

type SignUpResult = ActionResult<never>

export async function signUpAction(_prevState: SignUpResult | null, formData: FormData): Promise<SignUpResult> {
  try {
    const parsed = signUpSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password')
    })

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
      redirectTo: '/portal'
    })

    redirect('/portal')
  } catch (error) {
    console.error('Sign-up failed:', error)
    return { success: false, error: 'Could not create the account.' }
  }
}

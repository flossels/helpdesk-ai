'use server'

import { signOut } from '@/auth'

export async function signOutAction(redirectTo: string) {
  await signOut({ redirectTo })
}

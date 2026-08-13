import z from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(1, 'Please enter your name.'),
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.')
})

export type SignUpInput = z.infer<typeof signUpSchema>

export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Enter an organization name.').max(100)
})

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>

export const joinOrganizationSchema = z.object({
  token: z.string().min(1, 'Enter your invite code.')
})

export type JoinOrganizationInput = z.infer<typeof joinOrganizationSchema>

export const invitationSchema = z.object({
  email: z.email('Enter a valid email address.'),
  role: z.enum(['ADMIN', 'AGENT', 'VIEWER'])
})

export type InvitationInput = z.infer<typeof invitationSchema>

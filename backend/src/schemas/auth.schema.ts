import { z } from 'zod'

export const registerSchema = z.object({
    businessName: z.string().min(2).optional(),
    email: z.email(),
    password: z.string().min(6),
    inviteCode: z.string().optional()
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
import { z } from 'zod'

export const emailSignInSchema = z.object({
  email: z.email({
    message: 'Email inválido',
  }),
  password: z.string().min(1, {
    message: 'Senha é obrigatória',
  }),
})

export type EmailSignInSchema = z.infer<typeof emailSignInSchema>

import { z } from 'zod'

export const signUpSchema = z
  .object({
    fullName: z.string().min(1, { message: 'Nome completo é obrigatório' }),
    email: z.email({ message: 'Email inválido' }),
    password: z
      .string()
      .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' }),
    confirmPassword: z.string().min(8, {
      message: 'Confirme sua senha deve ter pelo menos 8 caracteres',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  })

export type SignUpSchema = z.infer<typeof signUpSchema>

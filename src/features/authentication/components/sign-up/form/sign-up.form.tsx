'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useSignUp } from '@/features/authentication/hooks/use-sign-up'
import {
  type SignUpSchema,
  signUpSchema,
} from '@/features/authentication/schemas/sign-up.schema'
import { cn } from '@/lib/utils'
import AppleCredentials from '../../shared/credentials/apple'
import GoogleCredentials from '../../shared/credentials/google'

interface SignUpFormProps extends React.ComponentProps<'div'> {
  disabled?: boolean
}

export default function SignUpForm({
  className,
  disabled,
  ...props
}: SignUpFormProps) {
  const { handleSignUp, isLoading } = useSignUp()

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    disabled: disabled || isLoading,
  })

  const handleSubmit = async (data: SignUpSchema): Promise<void> => {
    await handleSignUp(data)
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <span className="sr-only">ZapLink Tracker</span>
            </Link>
            <h1 className="text-xl font-bold">Crie sua conta</h1>
            <FieldDescription>
              Preencha o formulário abaixo para criar sua conta no ZapLink Tracker
            </FieldDescription>
          </div>

          <Controller
            control={form.control}
            name="fullName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Nome completo</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : (
                  <FieldDescription>
                    Usaremos este email para contato. Não compartilharemos seu
                    email com ninguém.
                  </FieldDescription>
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  placeholder="********"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : (
                  <FieldDescription>
                    Deve ter pelo menos 8 caracteres.
                  </FieldDescription>
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Confirmar senha</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  placeholder="********"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : (
                  <FieldDescription>Confirme sua senha.</FieldDescription>
                )}
              </Field>
            )}
          />

          <Field>
            <Button type="submit" loading={isLoading}>
              Criar conta
            </Button>
          </Field>

          <FieldSeparator>Ou continue com</FieldSeparator>

          <Field className="grid gap-4 sm:grid-cols-2">
            <AppleCredentials />
            <GoogleCredentials />
          </Field>
        </FieldGroup>
      </form>

      <div className="text-center text-sm">
        Já tem uma conta?{' '}
        <Link href="/auth/sign-in" className="underline underline-offset-4">
          Entrar
        </Link>
      </div>

      <FieldDescription className="px-6 text-center">
        Ao continuar, você concorda com nossos{' '}
        <Link href="#" className="underline underline-offset-4">
          Termos de Serviço
        </Link>{' '}
        e{' '}
        <Link href="#" className="underline underline-offset-4">
          Política de Privacidade
        </Link>
        .
      </FieldDescription>
    </div>
  )
}

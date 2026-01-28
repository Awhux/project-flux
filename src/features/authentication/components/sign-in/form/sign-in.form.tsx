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
import { useSignIn } from '@/features/authentication/hooks/use-sign-in'
import {
  type EmailSignInSchema,
  emailSignInSchema,
} from '@/features/authentication/schemas/sign-in.schema'
import { cn } from '@/lib/utils'
import AppleCredentials from '../../shared/credentials/apple'
import GoogleCredentials from '../../shared/credentials/google'

interface SignInCredentialsFormProps extends React.ComponentProps<'div'> {
  disabled?: boolean
}

export function SignInEmailForm({
  className,
  disabled,
  ...props
}: SignInCredentialsFormProps) {
  const { handleSignIn, isLoading } = useSignIn()
  const form = useForm<EmailSignInSchema>({
    resolver: zodResolver(emailSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    disabled: disabled || isLoading,
  })

  const handleSubmit = async (data: EmailSignInSchema): Promise<void> => {
    await handleSignIn(data)
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
            <h1 className="text-xl font-bold">Bem-vindo(a) ao ZapLink Tracker</h1>
            <FieldDescription>
              Não tem uma conta? <Link href="/auth/sign-up">Cadastre-se</Link>
            </FieldDescription>
          </div>
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
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
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field className="relative">
            <Button type="submit" loading={isLoading}>
              Entrar
            </Button>
          </Field>
          <FieldSeparator>Ou continue com</FieldSeparator>
          <Field className="grid gap-4 sm:grid-cols-2">
            <AppleCredentials />
            <GoogleCredentials />
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        Ao continuar, você concorda com nossos{' '}
        <Link href="#">Termos de Serviço</Link> e{' '}
        <Link href="#">Política de Privacidade</Link>.
      </FieldDescription>
    </div>
  )
}

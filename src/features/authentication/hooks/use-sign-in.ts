'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import type { EmailSignInSchema } from '@/features/authentication/schemas/sign-in.schema'
import { authClient } from '@/features/auth/client'
import { getCallbackURL } from '@/utils/app/links'

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSignIn = async (values: EmailSignInSchema) => {
    setIsLoading(true)
    const callbackURL = getCallbackURL(searchParams)

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL,
    })

    if (error) {
      setIsLoading(false)
      toast.error(
        error.message ?? 'Erro ao entrar. Verifique suas credenciais.',
      )
      return
    }

    setIsLoading(false)
    router.refresh()
  }

  return {
    isLoading,
    handleSignIn,
  }
}

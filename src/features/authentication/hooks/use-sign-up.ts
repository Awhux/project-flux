'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import type { SignUpSchema } from '@/features/authentication/schemas/sign-up.schema'
import { getCallbackURL } from '@/utils/app/links'
import { authClient } from '@/features/auth/client'

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSignUp = async (values: SignUpSchema) => {
    setIsLoading(true)
    const callbackURL = getCallbackURL(searchParams)

    const { error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.fullName,
      callbackURL,
    })

    if (error) {
      setIsLoading(false)
      toast.error(error.message ?? 'Erro ao criar conta. Tente novamente.')
      return
    }

    setIsLoading(false)
    toast.success('Conta criada com sucesso!')
    router.refresh()
  }

  return {
    isLoading,
    handleSignUp,
  }
}

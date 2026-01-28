'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { authClient } from '@/features/auth/client'
import { getCallbackURL } from '@/utils/app/links'

export function useSocialAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  const handleSocialSignIn = async (
    provider: 'apple' | 'google' | 'github' | 'discord' | 'microsoft',
  ) => {
    setIsLoading(true)
    const callbackURL = getCallbackURL(searchParams)

    const { error } = await authClient.signIn.social({
      provider,
      requestSignUp: true,
      callbackURL,
    })

    setIsLoading(false)

    if (error) {
      const providerName = provider.charAt(0).toUpperCase() + provider.slice(1)
      toast.error(
        `Erro ao entrar com ${providerName}. Tente novamente mais tarde.`,
      )
    }
  }

  return {
    isLoading,
    handleSocialSignIn,
  }
}

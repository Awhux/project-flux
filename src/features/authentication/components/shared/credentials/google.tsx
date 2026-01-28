'use client'

import { GoogleIcon } from '@/components/icons/google'
import { Button } from '@/components/ui/button'
import { useSocialAuth } from '@/features/authentication/hooks/use-social-auth'

export default function GoogleCredentials() {
  const { isLoading, handleSocialSignIn } = useSocialAuth()

  return (
    <Button
      onClick={() => handleSocialSignIn('google')}
      loading={isLoading}
      variant="outline"
      type="button"
    >
      <GoogleIcon />
      Entrar com Google
    </Button>
  )
}

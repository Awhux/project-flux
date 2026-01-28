'use client'

import { AppleIcon } from '@/components/icons/apple'
import { Button } from '@/components/ui/button'
import { useSocialAuth } from '@/features/authentication/hooks/use-social-auth'

export default function AppleCredentials() {
  const { isLoading, handleSocialSignIn } = useSocialAuth()

  return (
    <Button
      onClick={() => handleSocialSignIn('apple')}
      loading={isLoading}
      variant="outline"
      type="button"
      disabled
    >
      <AppleIcon />
      Entrar com Apple
    </Button>
  )
}

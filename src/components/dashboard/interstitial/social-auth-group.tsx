"use client"

import * as React from "react"
import { SocialAuthButton, SocialProvider } from "./social-auth-button"
import { useSocialAuth, SocialUserData } from "./hooks/use-social-auth"
import { cn } from "@/lib/utils"
import { CheckCircle2Icon, XCircleIcon } from "lucide-react"

interface SocialAuthGroupProps {
  onAuthSuccess: (userData: SocialUserData) => void
  onAuthError?: (error: string) => void
  className?: string
}

export function SocialAuthGroup({
  onAuthSuccess,
  onAuthError,
  className,
}: SocialAuthGroupProps) {
  const {
    userData,
    isLoading,
    error,
    loginWithGoogle,
    loginWithFacebook,
    loginWithInstagram,
    loginWithTikTok,
    clearData,
  } = useSocialAuth()

  const [activeProvider, setActiveProvider] = React.useState<SocialProvider | null>(null)
  const [showSuccess, setShowSuccess] = React.useState(false)

  // Handle successful authentication
  React.useEffect(() => {
    if (userData) {
      setShowSuccess(true)
      onAuthSuccess(userData)

      // Reset success indicator after a short delay
      const timer = setTimeout(() => {
        setShowSuccess(false)
        setActiveProvider(null)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [userData, onAuthSuccess])

  // Handle authentication error
  React.useEffect(() => {
    if (error) {
      onAuthError?.(error)
      setActiveProvider(null)
    }
  }, [error, onAuthError])

  const handleProviderClick = (provider: SocialProvider) => {
    setActiveProvider(provider)
    clearData()

    switch (provider) {
      case "google":
        loginWithGoogle()
        break
      case "facebook":
        loginWithFacebook()
        break
      case "instagram":
        loginWithInstagram()
        break
      case "tiktok":
        loginWithTikTok()
        break
    }
  }

  const providers: SocialProvider[] = ["google", "facebook", "instagram", "tiktok"]

  return (
    <div className={cn("space-y-4", className)}>
      {/* Success Message */}
      {showSuccess && userData && (
        <div className="animate-in fade-in slide-in-from-top-2 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2Icon className="h-4 w-4 flex-shrink-0" />
          <span>
            Dados de <strong>{userData.provider}</strong> carregados!
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && !showSuccess && (
        <div className="animate-in fade-in slide-in-from-top-2 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <XCircleIcon className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Social Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        {providers.map((provider) => (
          <SocialAuthButton
            key={provider}
            provider={provider}
            onClick={() => handleProviderClick(provider)}
            disabled={isLoading}
            isLoading={isLoading && activeProvider === provider}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">
            ou preencha manualmente
          </span>
        </div>
      </div>
    </div>
  )
}

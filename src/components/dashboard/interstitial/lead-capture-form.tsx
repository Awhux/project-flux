"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CheckIcon, ClockIcon, GiftIcon, Loader2Icon } from "lucide-react"
import { SocialAuthGroup } from "./social-auth-group"
import { PhoneInput } from "./phone-input"
import { TrustSignals } from "./trust-signals"
import { SocialUserData } from "./hooks/use-social-auth"

interface LeadCaptureFormProps {
  onSubmit: (data: { name?: string; phone: string; email?: string }) => Promise<void>
  linkSlug: string
  headline?: string
  subheadline?: string
  socialProofCount?: number
}

export function LeadCaptureForm({
  onSubmit,
  linkSlug,
  headline = "Garanta seu desconto exclusivo",
  subheadline = "Preencha rapidamente para continuar",
  socialProofCount = 1247,
}: LeadCaptureFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [isPhoneValid, setIsPhoneValid] = React.useState(false)
  const [socialData, setSocialData] = React.useState<SocialUserData | null>(null)
  const [isVisible, setIsVisible] = React.useState(false)

  // Animate in on mount
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Handle social auth success
  const handleSocialAuthSuccess = (userData: SocialUserData) => {
    setSocialData(userData)
    if (userData.name) setName(userData.name)
    if (userData.email) setEmail(userData.email)
  }

  // Handle phone change
  const handlePhoneChange = (value: string, isValid: boolean) => {
    setPhone(value)
    setIsPhoneValid(isValid)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isPhoneValid) return

    setIsLoading(true)

    try {
      await onSubmit({
        name: name || undefined,
        phone,
        email: email || undefined,
      })

      setIsSuccess(true)
    } catch (error) {
      console.error("Form submission error:", error)
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn(
        "w-full max-w-md transition-all duration-500 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white md:shadow-xl shadow-none">
        {/* Header with gradient accent */}
        <div className="relative px-6 pb-4 pt-8 sm:px-10 sm:pt-10">
          {/* Headline */}
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {headline}
            </h2>
            <p className="mt-2 text-base text-gray-600">{subheadline}</p>
          </div>

          {/* Time indicator */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-sm text-gray-500">
            <ClockIcon className="h-4 w-4" />
            <span>Leva apenas 10 segundos</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 pb-8 pt-6 sm:px-10 sm:pb-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (only shown if autofilled or user wants to add) */}
            <div
              className={cn(
                "space-y-2 transition-all duration-300",
                !name && !socialData
                  ? "max-h-0 opacity-0 overflow-hidden"
                  : "max-h-24 opacity-100"
              )}
            >
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-base transition-all focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
                {socialData?.avatar && (
                  <img
                    src={socialData.avatar}
                    alt=""
                    className="absolute right-3 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full ring-2 ring-white"
                  />
                )}
              </div>
            </div>

            {/* Email Field (only shown if autofilled) */}
            {email && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-base transition-all focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}

            {/* Phone Field (Required) */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                WhatsApp <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                id="phone"
                name="phone"
                value={phone}
                onChange={handlePhoneChange}
                countryCode="BR"
                showCountryFlag={true}
                error={phone.length > 0 && !isPhoneValid ? "Número inválido" : undefined}
              />
            </div>

            {/* Add name manually button (if not autofilled) */}
            {!name && !socialData && (
              <button
                type="button"
                onClick={() => setName(" ")}
                className="text-sm text-primary hover:underline"
              >
                + Adicionar nome (opcional)
              </button>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isPhoneValid || isLoading || isSuccess}
              className={cn(
                "mt-2 h-14 w-full rounded-xl text-base font-semibold shadow-lg transition-all duration-300",
                isSuccess
                  ? "bg-green-500 hover:bg-green-600 shadow-green-500/25"
                  : "bg-[#25D366] hover:bg-[#128C7E] shadow-[#25D366]/25"
              )}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="h-5 w-5 animate-spin" />
                  Enviando...
                </span>
              ) : isSuccess ? (
                <span className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5" />
                  Redirecionando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Continuar para WhatsApp
                </span>
              )}
            </Button>
          </form>

          {/* Trust Signals */}
          <div className="mt-6">
            <TrustSignals
              leadsCount={socialProofCount}
              showSecurityBadge={true}
              showSocialProof={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

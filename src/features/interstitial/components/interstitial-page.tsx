"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Loader2Icon, UsersIcon, TimerIcon, MessageSquareIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { InterstitialFormFields } from "./form-fields"
import { TrustElements } from "./trust-elements"
import type {
  InterstitialConfig,
  InterstitialFormData,
  InterstitialPageProps,
} from "../types"

/**
 * WhatsApp icon for the CTA button
 */
const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

/**
 * Social proof indicator
 */
const SocialProof = React.memo(function SocialProof({
  count,
  text,
  isDark,
}: {
  count: number
  text: string
  isDark: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm",
        isDark ? "bg-white/10 text-white/80" : "bg-primary-50 text-primary-700"
      )}
    >
      <UsersIcon className="h-4 w-4" />
      <span>
        <strong>{count.toLocaleString("pt-BR")}</strong> {text}
      </span>
    </div>
  )
})

/**
 * Countdown timer display
 */
const CountdownTimer = React.memo(function CountdownTimer({
  seconds,
  isDark,
}: {
  seconds: number
  isDark: boolean
}) {
  const [timeLeft, setTimeLeft] = React.useState(seconds)

  React.useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const minutes = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm font-medium",
        isDark ? "text-white/80" : "text-gray-600"
      )}
    >
      <TimerIcon className="h-4 w-4" />
      <span>
        {minutes > 0 ? `${minutes}:${secs.toString().padStart(2, "0")}` : `${secs}s`}
      </span>
    </div>
  )
})

/**
 * Default form data
 */
const DEFAULT_FORM_DATA: InterstitialFormData = {
  name: "",
  email: "",
  phone: "",
  privacyAccepted: false,
}

/**
 * InterstitialPage - Real production component for the Ghost Mode capture page
 * 
 * This component renders the full interstitial page that captures lead information
 * before redirecting to WhatsApp. It can also be used in preview mode within the
 * link creation modal.
 */
export const InterstitialPage = React.memo(function InterstitialPage({
  config,
  onSubmit,
  isPreview = false,
  className,
}: InterstitialPageProps) {
  const [formData, setFormData] = React.useState<InterstitialFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = React.useState<Partial<Record<keyof InterstitialFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const isDark = config.theme === "dark"

  const handleFieldChange = React.useCallback(
    (field: keyof InterstitialFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      // Clear error when field is changed
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    [errors]
  )

  const validateForm = React.useCallback((): boolean => {
    const newErrors: typeof errors = {}

    if (config.collectName && config.nameRequired && !formData.name?.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (config.collectEmail && config.emailRequired && !formData.email?.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    const phoneDigits = formData.phone.replace(/\D/g, "")
    if (!phoneDigits || phoneDigits.length < 10) {
      newErrors.phone = "Telefone inválido"
    }

    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = "Você deve aceitar os termos"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [config, formData])

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (isPreview) return

      if (!validateForm()) return

      setIsSubmitting(true)

      try {
        await onSubmit?.(formData)
        setIsSuccess(true)
      } catch (error) {
        console.error("Error submitting form:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, onSubmit, validateForm, isPreview]
  )

  // Background styles
  const backgroundStyle: React.CSSProperties = {
    backgroundColor: config.bgColor,
    ...(config.bgImage && {
      backgroundImage: `url(${config.bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }),
  }

  // Overlay styles
  const overlayStyle: React.CSSProperties = config.bgImage
    ? {
      backgroundColor: isDark
        ? `rgba(0, 0, 0, ${config.bgOverlayOpacity / 100})`
        : `rgba(255, 255, 255, ${config.bgOverlayOpacity / 100})`,
    }
    : {}

  return (
    <div
      className={cn(
        "relative flex min-h-full w-full items-center justify-center p-4",
        className
      )}
      style={backgroundStyle}
    >
      {/* Background Overlay */}
      {config.bgImage && (
        <div className="absolute inset-0" style={overlayStyle} />
      )}

      {/* Content Card */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl p-6 shadow-2xl",
          isDark ? "bg-gray-900/90 backdrop-blur-md" : "bg-white"
        )}
      >
        {/* Logo */}
        {config.logo && (
          <div className="mb-6 flex justify-center">
            <img
              src={config.logo}
              alt="Logo"
              className="h-12 max-w-[200px] object-contain"
            />
          </div>
        )}

        {/* Social Proof */}
        {config.socialProofEnabled && (
          <div className="mb-6 flex justify-center">
            <SocialProof
              count={config.socialProofCount}
              text={config.socialProofText}
              isDark={isDark}
            />
          </div>
        )}

        {/* Headline */}
        <h1
          className={cn(
            "mb-2 text-center text-xl font-bold leading-tight",
            isDark ? "text-white" : "text-gray-900"
          )}
        >
          {config.headline || "Confirme seu WhatsApp"}
        </h1>

        {/* Description */}
        {config.description && (
          <p
            className={cn(
              "mb-6 text-center text-sm",
              isDark ? "text-white/70" : "text-gray-600"
            )}
          >
            {config.description}
          </p>
        )}

        {/* Form - Use div in preview mode to avoid nested forms */}
        {React.createElement(
          isPreview ? "div" : "form",
          {
            ...(isPreview ? {} : { onSubmit: handleSubmit }),
            className: "space-y-5",
          },
          <>
            <InterstitialFormFields
              config={config}
              values={formData}
              onChange={handleFieldChange}
              errors={errors}
              disabled={isSubmitting || isSuccess || isPreview}
            />

            {/* Countdown */}
            {config.countdownEnabled && (
              <div className="flex justify-center">
                <CountdownTimer seconds={config.countdownSeconds} isDark={isDark} />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type={isPreview ? "button" : "submit"}
              disabled={isSubmitting || isSuccess || isPreview}
              className={cn(
                "h-14 w-full gap-2 rounded-xl text-base font-semibold transition-all",
                isSuccess
                  ? "bg-green-500 hover:bg-green-500"
                  : "bg-[#25D366] hover:bg-[#128C7E]"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : isSuccess ? (
                <>
                  <MessageSquareIcon className="h-5 w-5" />
                  Redirecionando...
                </>
              ) : (
                <>
                  <WhatsAppIcon />
                  {config.buttonText || "Continuar para WhatsApp"}
                </>
              )}
            </Button>
          </>
        )}

        {/* Trust Elements */}
        {(config.securityBadges.length > 0 || config.testimonials.length > 0) && (
          <div className="mt-6">
            <TrustElements
              securityBadges={config.securityBadges}
              testimonials={config.testimonials}
              theme={config.theme}
            />
          </div>
        )}

        {/* Custom CSS (only in production) */}
        {config.customCss && !isPreview && (
          <style dangerouslySetInnerHTML={{ __html: config.customCss }} />
        )}
      </div>
    </div>
  )
})

InterstitialPage.displayName = "InterstitialPage"

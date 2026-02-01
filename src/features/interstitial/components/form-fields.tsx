"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { InterstitialFormFieldsProps } from "../types"

/**
 * Formats a phone number input with Brazilian format
 */
function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "")

  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : ""
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

/**
 * Form fields component for the interstitial page
 * Renders name, email, phone, and privacy checkbox based on configuration
 */
export const InterstitialFormFields = React.memo(function InterstitialFormFields({
  config,
  values,
  onChange,
  errors,
  disabled = false,
}: InterstitialFormFieldsProps) {
  const isDark = config.theme === "dark"

  const inputClassName = cn(
    "h-12 w-full rounded-lg border bg-white/10 px-4 text-base backdrop-blur-sm transition-all",
    "placeholder:text-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
    isDark
      ? "border-white/20 text-white placeholder:text-white/50"
      : "border-gray-300 text-gray-900",
    disabled && "opacity-50 cursor-not-allowed"
  )

  const labelClassName = cn(
    "block text-sm font-medium mb-2",
    isDark ? "text-white" : "text-gray-700"
  )

  const errorClassName = "text-xs text-red-500 mt-1"

  const handlePhoneChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value)
      onChange("phone", formatted)
    },
    [onChange]
  )

  return (
    <div className="w-full space-y-4">
      {/* Name Field */}
      {config.collectName && (
        <div>
          <label htmlFor="interstitial-name" className={labelClassName}>
            Nome {config.nameRequired && <span className="text-red-500">*</span>}
          </label>
          <Input
            id="interstitial-name"
            type="text"
            value={values.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Seu nome"
            className={inputClassName}
            disabled={disabled}
            required={config.nameRequired}
          />
          {errors?.name && <p className={errorClassName}>{errors.name}</p>}
        </div>
      )}

      {/* Email Field */}
      {config.collectEmail && (
        <div>
          <label htmlFor="interstitial-email" className={labelClassName}>
            Email {config.emailRequired && <span className="text-red-500">*</span>}
          </label>
          <Input
            id="interstitial-email"
            type="email"
            value={values.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="seu@email.com"
            className={inputClassName}
            disabled={disabled}
            required={config.emailRequired}
          />
          {errors?.email && <p className={errorClassName}>{errors.email}</p>}
        </div>
      )}

      {/* Phone Field (Always Required) */}
      <div>
        <label htmlFor="interstitial-phone" className={labelClassName}>
          {config.phoneLabel} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div
            className={cn(
              "absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-sm",
              isDark ? "text-white/70" : "text-gray-500"
            )}
          >
            <span className="font-medium">+55</span>
          </div>
          <Input
            id="interstitial-phone"
            type="tel"
            value={values.phone}
            onChange={handlePhoneChange}
            placeholder="(11) 99999-9999"
            className={cn(inputClassName, "pl-14")}
            disabled={disabled}
            required
          />
        </div>
        {errors?.phone && <p className={errorClassName}>{errors.phone}</p>}
      </div>

      {/* Privacy Checkbox */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="interstitial-privacy"
          checked={values.privacyAccepted}
          onCheckedChange={(checked) => onChange("privacyAccepted", checked === true)}
          disabled={disabled}
          className={cn(
            "mt-0.5",
            isDark && "border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-primary-600"
          )}
        />
        <label
          htmlFor="interstitial-privacy"
          className={cn(
            "text-sm cursor-pointer",
            isDark ? "text-white/80" : "text-gray-600"
          )}
        >
          {config.privacyCheckboxText}
          {config.privacyPolicyUrl && (
            <>
              {" "}
              <a
                href={config.privacyPolicyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "underline hover:no-underline",
                  isDark ? "text-white" : "text-primary-600"
                )}
              >
                Política de Privacidade
              </a>
            </>
          )}
        </label>
      </div>
      {errors?.privacyAccepted && (
        <p className={errorClassName}>{errors.privacyAccepted}</p>
      )}
    </div>
  )
})

InterstitialFormFields.displayName = "InterstitialFormFields"

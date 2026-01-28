"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { parsePhoneNumber, AsYouType, CountryCode } from "libphonenumber-js"

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: string
  onChange?: (value: string, isValid: boolean) => void
  countryCode?: CountryCode
  showCountryFlag?: boolean
  error?: string
}

const countryData: Record<CountryCode, { flag: string; code: string }> = {
  BR: { flag: "🇧🇷", code: "+55" },
  US: { flag: "🇺🇸", code: "+1" },
  PT: { flag: "🇵🇹", code: "+351" },
  AR: { flag: "🇦🇷", code: "+54" },
  MX: { flag: "🇲🇽", code: "+52" },
} as Record<CountryCode, { flag: string; code: string }>

export function PhoneInput({
  value = "",
  onChange,
  countryCode = "BR",
  showCountryFlag = true,
  error,
  className,
  disabled,
  ...props
}: PhoneInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)
  const [isValid, setIsValid] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const country = countryData[countryCode] || countryData.BR

  // Format the phone number as user types
  const formatPhoneNumber = React.useCallback(
    (rawValue: string): string => {
      // Remove all non-digits
      const digits = rawValue.replace(/\D/g, "")

      // For Brazilian numbers, apply mask
      if (countryCode === "BR") {
        if (digits.length <= 2) {
          return digits.length > 0 ? `(${digits}` : ""
        } else if (digits.length <= 7) {
          return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
        } else if (digits.length <= 11) {
          const hasNinthDigit = digits.length === 11
          if (hasNinthDigit) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
          }
          return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
        }
        // Max length reached
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
      }

      // Use libphonenumber-js for other countries
      const formatter = new AsYouType(countryCode)
      return formatter.input(rawValue) || rawValue
    },
    [countryCode]
  )

  // Validate phone number
  const validatePhoneNumber = React.useCallback(
    (rawValue: string): boolean => {
      try {
        const digits = rawValue.replace(/\D/g, "")

        // Brazilian validation
        if (countryCode === "BR") {
          // Valid lengths: 10 (landline) or 11 (mobile)
          return digits.length === 10 || digits.length === 11
        }

        // Use libphonenumber-js for other countries
        const phoneNumber = parsePhoneNumber(rawValue, countryCode)
        return phoneNumber?.isValid() || false
      } catch {
        return false
      }
    },
    [countryCode]
  )

  // Update internal state when external value changes
  React.useEffect(() => {
    if (value) {
      const formatted = formatPhoneNumber(value)
      setInputValue(formatted)
      setIsValid(validatePhoneNumber(value))
    }
  }, [value, formatPhoneNumber, validatePhoneNumber])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const formatted = formatPhoneNumber(rawValue)
    const valid = validatePhoneNumber(rawValue)

    setInputValue(formatted)
    setIsValid(valid)

    // Return only digits to parent
    const digitsOnly = rawValue.replace(/\D/g, "")
    onChange?.(digitsOnly, valid)
  }

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "relative flex items-center rounded-xl border bg-white transition-all duration-200",
          isFocused
            ? "border-primary ring-2 ring-primary/20"
            : error
              ? "border-red-500 ring-2 ring-red-500/20"
              : isValid && inputValue
                ? "border-green-500"
                : "border-gray-300 hover:border-gray-400",
          disabled && "cursor-not-allowed bg-gray-50 opacity-60"
        )}
      >
        {/* Country Code Prefix */}
        {showCountryFlag && (
          <div className="flex items-center gap-1.5 border-r border-gray-200 bg-gray-50 px-3 py-3 rounded-l-xl">
            <span className="text-lg leading-none">{country.flag}</span>
            <span className="text-sm font-medium text-gray-600">{country.code}</span>
          </div>
        )}

        {/* Phone Input */}
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={cn(
            "h-14 flex-1 bg-transparent px-4 text-base outline-none placeholder:text-gray-400",
            !showCountryFlag && "rounded-xl",
            className
          )}
          placeholder="(11) 99999-9999"
          {...props}
        />

        {/* Validation Indicator */}
        {inputValue && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  )
}

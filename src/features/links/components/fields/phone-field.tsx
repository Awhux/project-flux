"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { formatPhoneNumber } from "../../utils/format-phone"

export interface PhoneFieldProps {
  /** Current phone value */
  value: string
  /** Error message */
  error?: string
  /** Whether field has been touched */
  touched?: boolean
  /** Called when phone changes */
  onChange: (value: string) => void
  /** Called when field loses focus */
  onBlur?: () => void
  /** Whether field is disabled */
  disabled?: boolean
  /** Additional class names */
  className?: string
}

/**
 * Reusable phone input field component
 * 
 * Features:
 * - Brazil country prefix (+55)
 * - Auto-formatting as user types
 * - Validation feedback
 */
export const PhoneField = React.memo(function PhoneField({
  value,
  error,
  touched,
  onChange,
  onBlur,
  disabled,
  className,
}: PhoneFieldProps) {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/[^\d\s()-]/g, "")
      const formatted = formatPhoneNumber(digits)
      onChange(formatted)
    },
    [onChange]
  )

  const showError = touched && error

  return (
    <Field className={className}>
      <FieldLabel htmlFor="phone">
        Número do WhatsApp <span className="text-destructive">*</span>
      </FieldLabel>
      <div className="relative">
        <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">+55</span>
        </div>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(
            "h-10 pl-14",
            showError && "border-destructive focus-visible:ring-destructive"
          )}
          placeholder="(11) 99999-9999"
          required
          autoComplete="tel"
        />
      </div>
      {showError ? (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      ) : (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Formato: (DD) 9XXXX-XXXX
        </p>
      )}
    </Field>
  )
})

PhoneField.displayName = "PhoneField"

"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { CheckCircleIcon, AlertCircleIcon, Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { SLUG_MAX_LENGTH } from "../../config/links.config"
import { normalizeSlug } from "../../utils/validate-slug"
import { APP_URL } from "@/utils/app/links"

export interface SlugFieldProps {
  /** Current slug value */
  value: string
  /** Error message */
  error?: string
  /** Whether field has been touched */
  touched?: boolean
  /** Whether slug uniqueness is being checked */
  isChecking?: boolean
  /** Whether slug is valid (unique) */
  isValid?: boolean | null
  /** Called when slug changes */
  onChange: (value: string) => void
  /** Called when field loses focus */
  onBlur?: () => void
  /** Whether field is disabled */
  disabled?: boolean
  /** Additional class names */
  className?: string
}

/**
 * Reusable slug input field component
 * 
 * Features:
 * - Prefix with domain (uses APP_URL.host)
 * - Character counter
 * - Loading/valid/invalid states
 * - Automatic slug normalization
 */
export const SlugField = React.memo(function SlugField({
  value,
  error,
  touched,
  isChecking,
  isValid,
  onChange,
  onBlur,
  disabled,
  className,
}: SlugFieldProps) {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const normalized = normalizeSlug(e.target.value)
      onChange(normalized)
    },
    [onChange]
  )

  const showError = touched && error
  const isOverLimit = value.length > SLUG_MAX_LENGTH

  return (
    <Field className={className}>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor="slug">
          Slug do Link <span className="text-destructive">*</span>
        </FieldLabel>
        <span
          className={cn(
            "text-xs",
            isOverLimit ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {value.length}/{SLUG_MAX_LENGTH}
        </span>
      </div>
      <div className="flex items-center">
        <span className="inline-flex h-10 items-center rounded-l-lg border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
          {APP_URL.host}/
        </span>
        <div className="relative flex-1">
          <Input
            id="slug"
            name="slug"
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            className={cn(
              "h-10 rounded-l-none pr-10",
              showError && "border-destructive focus-visible:ring-destructive"
            )}
            placeholder="minha-promo"
            required
            autoComplete="off"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isChecking && (
              <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {!isChecking && isValid === true && (
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            )}
            {!isChecking && isValid === false && (
              <AlertCircleIcon className="h-4 w-4 text-destructive" />
            )}
          </div>
        </div>
      </div>
      {showError ? (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      ) : (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Use apenas letras minúsculas, números e hífens
        </p>
      )}
    </Field>
  )
})

SlugField.displayName = "SlugField"

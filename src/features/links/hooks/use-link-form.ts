"use client"

import * as React from "react"
import { validateSlug } from "../utils/validate-slug"
import { getPhoneError } from "../utils/format-phone"
import { MESSAGE_MAX_LENGTH } from "../config/links.config"
import { DEFAULT_INTERSTITIAL_CONFIG, type InterstitialConfig } from "@/features/interstitial"

/**
 * Form state interface
 */
export interface LinkFormState {
  slug: string
  phone: string
  message: string
  pixelId: string
  capiToken: string
  ghostMode: boolean
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmContent: string
  interstitial: InterstitialConfig
}

/**
 * Form errors interface
 */
export interface LinkFormErrors {
  slug?: string
  phone?: string
  message?: string
}

/**
 * Form validation state
 */
export interface LinkFormValidation {
  errors: LinkFormErrors
  touched: Record<string, boolean>
  isSlugValid: boolean | null
  isSlugChecking: boolean
  isFormValid: boolean
}

/**
 * Return type for useLinkForm hook
 */
export interface UseLinkFormReturn {
  formState: LinkFormState
  validation: LinkFormValidation
  handlers: {
    onSlugChange: (value: string) => void
    onPhoneChange: (value: string) => void
    onMessageChange: (value: string) => void
    onPixelIdChange: (value: string) => void
    onCapiTokenChange: (value: string) => void
    onGhostModeChange: (value: boolean) => void
    onUtmChange: (field: string, value: string) => void
    onInterstitialChange: (config: Partial<InterstitialConfig>) => void
    onFieldBlur: (field: string) => void
    resetForm: () => void
    validateForm: () => boolean
  }
}

/**
 * Initial form state
 */
const INITIAL_FORM_STATE: LinkFormState = {
  slug: "",
  phone: "",
  message: "",
  pixelId: "",
  capiToken: "",
  ghostMode: false,
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  interstitial: DEFAULT_INTERSTITIAL_CONFIG,
}

/**
 * Validates the message field
 */
function validateMessage(value: string): string | undefined {
  if (!value) return "Mensagem é obrigatória"
  if (value.length > MESSAGE_MAX_LENGTH) {
    return `Mensagem deve ter menos de ${MESSAGE_MAX_LENGTH} caracteres`
  }
  return undefined
}

/**
 * Debounce hook for slug uniqueness check
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Custom hook for managing link form state
 * 
 * This hook provides:
 * - Stable callback handlers (won't cause re-renders)
 * - Form validation
 * - Slug uniqueness checking with debounce
 * - Proper state isolation
 * 
 * @example
 * ```tsx
 * const { formState, validation, handlers } = useLinkForm()
 * 
 * <SlugField
 *   value={formState.slug}
 *   onChange={handlers.onSlugChange}
 *   error={validation.errors.slug}
 * />
 * ```
 */
export function useLinkForm(): UseLinkFormReturn {
  // Form state
  const [formState, setFormState] = React.useState<LinkFormState>(INITIAL_FORM_STATE)

  // Validation state
  const [errors, setErrors] = React.useState<LinkFormErrors>({})
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})
  const [isSlugValid, setIsSlugValid] = React.useState<boolean | null>(null)
  const [isSlugChecking, setIsSlugChecking] = React.useState(false)

  // Debounced slug for uniqueness check
  const debouncedSlug = useDebounce(formState.slug, 500)

  // Check slug uniqueness when debounced slug changes
  React.useEffect(() => {
    if (!debouncedSlug || validateSlug(debouncedSlug)) {
      setIsSlugValid(null)
      setIsSlugChecking(false)
      return
    }

    setIsSlugChecking(true)

    // Simulate API check - replace with actual API call
    const checkSlug = async () => {
      // Simulated delay for API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      const isAvailable = !["test", "admin", "api", "app", "www"].includes(debouncedSlug)
      setIsSlugValid(isAvailable)
      setIsSlugChecking(false)

      if (!isAvailable) {
        setErrors((prev) => ({ ...prev, slug: "Este slug já está em uso" }))
      }
    }

    checkSlug()
  }, [debouncedSlug])

  // Stable handlers using useCallback with functional updates
  // These handlers won't cause re-renders when passed as props

  const onSlugChange = React.useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, slug: value }))
    setErrors((prev) => ({ ...prev, slug: validateSlug(value) }))
    setIsSlugValid(null)
  }, [])

  const onPhoneChange = React.useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, phone: value }))
    setErrors((prev) => ({ ...prev, phone: getPhoneError(value) }))
  }, [])

  const onMessageChange = React.useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, message: value }))
    setErrors((prev) => ({ ...prev, message: validateMessage(value) }))
  }, [])

  const onPixelIdChange = React.useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, pixelId: value }))
  }, [])

  const onCapiTokenChange = React.useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, capiToken: value }))
  }, [])

  const onGhostModeChange = React.useCallback((value: boolean) => {
    setFormState((prev) => ({ ...prev, ghostMode: value }))
  }, [])

  const onUtmChange = React.useCallback((field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }, [])

  const onInterstitialChange = React.useCallback((config: Partial<InterstitialConfig>) => {
    setFormState((prev) => ({
      ...prev,
      interstitial: { ...prev.interstitial, ...config },
    }))
  }, [])

  const onFieldBlur = React.useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  const resetForm = React.useCallback(() => {
    setFormState(INITIAL_FORM_STATE)
    setErrors({})
    setTouched({})
    setIsSlugValid(null)
    setIsSlugChecking(false)
  }, [])

  const validateForm = React.useCallback((): boolean => {
    const newErrors: LinkFormErrors = {
      slug: validateSlug(formState.slug),
      phone: getPhoneError(formState.phone),
      message: validateMessage(formState.message),
    }

    // Check slug uniqueness
    if (!newErrors.slug && isSlugValid === false) {
      newErrors.slug = "Este slug já está em uso"
    }

    setErrors(newErrors)
    setTouched({ slug: true, phone: true, message: true })

    return !Object.values(newErrors).some(Boolean)
  }, [formState.slug, formState.phone, formState.message, isSlugValid])

  // Compute if form is valid
  const isFormValid = React.useMemo(() => {
    return (
      !errors.slug &&
      !errors.phone &&
      !errors.message &&
      formState.slug.length > 0 &&
      formState.phone.length > 0 &&
      formState.message.length > 0 &&
      isSlugValid !== false
    )
  }, [errors, formState.slug, formState.phone, formState.message, isSlugValid])

  // Memoize validation object to prevent unnecessary re-renders
  const validation = React.useMemo<LinkFormValidation>(
    () => ({
      errors,
      touched,
      isSlugValid,
      isSlugChecking,
      isFormValid,
    }),
    [errors, touched, isSlugValid, isSlugChecking, isFormValid]
  )

  // Memoize handlers object to prevent unnecessary re-renders
  const handlers = React.useMemo(
    () => ({
      onSlugChange,
      onPhoneChange,
      onMessageChange,
      onPixelIdChange,
      onCapiTokenChange,
      onGhostModeChange,
      onUtmChange,
      onInterstitialChange,
      onFieldBlur,
      resetForm,
      validateForm,
    }),
    [
      onSlugChange,
      onPhoneChange,
      onMessageChange,
      onPixelIdChange,
      onCapiTokenChange,
      onGhostModeChange,
      onUtmChange,
      onInterstitialChange,
      onFieldBlur,
      resetForm,
      validateForm,
    ]
  )

  return {
    formState,
    validation,
    handlers,
  }
}

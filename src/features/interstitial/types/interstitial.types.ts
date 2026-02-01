/**
 * Interstitial Page Domain Types
 * 
 * Types for the Ghost Mode interstitial/capture page that collects
 * lead information before redirecting to WhatsApp.
 */

/**
 * Testimonial displayed on the interstitial page
 */
export interface Testimonial {
  text: string
  author: string
  rating: number
}

/**
 * Security badge configuration
 */
export interface SecurityBadge {
  id: string
  label: string
  icon: "lock" | "shield" | "document" | "check"
}

/**
 * Theme configuration for the interstitial page
 */
export type InterstitialTheme = "light" | "dark"

/**
 * Complete configuration for an interstitial page
 */
export interface InterstitialConfig {
  // Visual customization
  logo?: string
  headline: string
  description: string
  buttonText: string
  bgColor: string
  bgImage?: string
  bgOverlayOpacity: number
  theme: InterstitialTheme

  // Form fields
  collectName: boolean
  nameRequired: boolean
  collectEmail: boolean
  emailRequired: boolean
  phoneLabel: string
  privacyPolicyUrl: string
  privacyCheckboxText: string

  // Advanced features
  customCss: string
  countdownEnabled: boolean
  countdownSeconds: number
  countdownRedirectUrl: string
  socialProofEnabled: boolean
  socialProofCount: number
  socialProofText: string
  exitIntentEnabled: boolean
  exitIntentMessage: string
  exitIntentOfferText: string

  // Trust elements
  securityBadges: string[]
  testimonials: Testimonial[]
}

/**
 * Form data collected from the interstitial page
 */
export interface InterstitialFormData {
  name?: string
  email?: string
  phone: string
  privacyAccepted: boolean
}

/**
 * Props for the interstitial page component
 */
export interface InterstitialPageProps {
  config: InterstitialConfig
  onSubmit?: (data: InterstitialFormData) => void | Promise<void>
  isPreview?: boolean
  className?: string
}

/**
 * Props for the form fields component
 */
export interface InterstitialFormFieldsProps {
  config: Pick<
    InterstitialConfig,
    | "collectName"
    | "nameRequired"
    | "collectEmail"
    | "emailRequired"
    | "phoneLabel"
    | "privacyCheckboxText"
    | "privacyPolicyUrl"
    | "theme"
  >
  values: InterstitialFormData
  onChange: (field: keyof InterstitialFormData, value: string | boolean) => void
  errors?: Partial<Record<keyof InterstitialFormData, string>>
  disabled?: boolean
}

/**
 * Props for the trust elements component
 */
export interface TrustElementsProps {
  securityBadges: string[]
  testimonials: Testimonial[]
  theme: InterstitialTheme
  className?: string
}

/**
 * Default configuration values
 */
export const DEFAULT_INTERSTITIAL_CONFIG: InterstitialConfig = {
  logo: "",
  headline: "Para acessar o desconto, confirme seu WhatsApp",
  description: "Isso leva apenas 5 segundos",
  buttonText: "Continuar para WhatsApp",
  bgColor: "#4F46E5",
  bgImage: "",
  bgOverlayOpacity: 50,
  theme: "light",
  collectName: false,
  nameRequired: false,
  collectEmail: false,
  emailRequired: false,
  phoneLabel: "WhatsApp",
  privacyPolicyUrl: "",
  privacyCheckboxText: "Aceito receber mensagens no WhatsApp",
  customCss: "",
  countdownEnabled: false,
  countdownSeconds: 30,
  countdownRedirectUrl: "",
  socialProofEnabled: false,
  socialProofCount: 100,
  socialProofText: "pessoas clicaram esta semana",
  exitIntentEnabled: false,
  exitIntentMessage: "Espere! Não vá embora ainda...",
  exitIntentOfferText: "",
  securityBadges: [],
  testimonials: [],
}

/**
 * Available security badges with their icons
 */
export const SECURITY_BADGES: SecurityBadge[] = [
  { id: "ssl", label: "SSL Seguro", icon: "lock" },
  { id: "privacy", label: "Privacidade", icon: "shield" },
  { id: "lgpd", label: "LGPD", icon: "document" },
  { id: "verified", label: "Verificado", icon: "check" },
]

/**
 * Link feature types
 */

export interface Link {
  id: string
  slug: string
  destination: string
  message: string
  clicks: number
  trend: TrendIndicator
  active: boolean
  ghostMode: boolean
  pixelId?: string
  createdAt: Date
}

export interface TrendIndicator {
  value: number
  isPositive: boolean
}

export interface LinkStats {
  totalLinks: number
  totalClicks: number
  activeLinks: number
  avgClickRate: number
  clicksTrend?: TrendIndicator
}

/**
 * Testimonial for interstitial page
 */
export interface Testimonial {
  text: string
  author: string
  rating: number
}

/**
 * Interstitial page configuration
 */
export interface InterstitialFormData {
  // Visual customization
  logo?: string
  headline: string
  description: string
  buttonText: string
  bgColor: string
  bgImage?: string
  bgOverlayOpacity: number
  theme: "light" | "dark"

  // Form fields
  collectName: boolean
  nameRequired: boolean
  collectEmail: boolean
  emailRequired: boolean
  phoneLabel: string
  privacyPolicyUrl?: string
  privacyCheckboxText: string

  // Advanced features
  customCss?: string
  countdownEnabled: boolean
  countdownSeconds: number
  countdownRedirectUrl?: string
  socialProofEnabled: boolean
  socialProofCount: number
  socialProofText: string
  exitIntentEnabled: boolean
  exitIntentMessage?: string
  exitIntentOfferText?: string

  // Trust elements
  securityBadges: string[]
  testimonials: Testimonial[]
}

/**
 * Form data for creating/editing a link
 */
export interface LinkFormData {
  // Basic fields
  slug: string
  phone: string
  message: string

  // Facebook tracking
  pixelId?: string
  capiToken?: string

  // Link configuration
  ghostMode: boolean

  // UTM defaults
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string

  // Interstitial configuration (when ghostMode is true)
  interstitial?: InterstitialFormData
}

export interface LinkFilters {
  search: string
  status: StatusFilter
  sortBy: SortOption
}

export type StatusFilter = "all" | "active" | "inactive"

export type SortOption =
  | "newest"
  | "oldest"
  | "most-clicks"
  | "least-clicks"
  | "a-z"
  | "z-a"

export interface DisplayLink extends Omit<Link, "createdAt"> {
  createdAt: string
}

/**
 * Link Mapper Service
 * 
 * Converts between Prisma Link model and frontend API types.
 * Handles flattening/unflattening of interstitial configuration fields.
 */

import type { Link as PrismaLink } from "@prisma/client"
import { Prisma } from "@prisma/client"
import type { ApiLink, CreateLinkRequest } from "../types/api.types"
import type { InterstitialFormData, Testimonial } from "../types/links.types"
import { DEFAULT_INTERSTITIAL_CONFIG } from "@/features/interstitial"

// App URL for generating short links
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

/**
 * Convert a Prisma Link to API Link format
 */
export function prismaLinkToApiLink(link: PrismaLink): ApiLink {
  return {
    id: link.id,
    slug: link.slug,
    destination: link.destinationNumber,
    message: link.messageTemplate,
    clicks: link.clickCount,
    leads: link.leadCount,
    active: link.isActive,
    ghostMode: link.ghostMode,
    pixelId: link.pixelId || undefined,
    capiToken: link.capiToken || undefined,
    utmSource: link.defaultUtmSource || undefined,
    utmMedium: link.defaultUtmMedium || undefined,
    utmCampaign: link.defaultUtmCampaign || undefined,
    utmContent: link.defaultUtmContent || undefined,
    interstitial: extractInterstitialConfig(link),
    shortUrl: `${APP_URL}/l/${link.slug}`,
    createdAt: link.createdAt.toISOString(),
    updatedAt: link.updatedAt.toISOString(),
  }
}

/**
 * Extract interstitial configuration from Prisma Link fields
 * 
 * Uses nullish coalescing (??) for fields where null should use defaults,
 * and OR (||) for fields where empty strings should also use defaults.
 * This ensures custom values are preserved when they exist in the database.
 */
export function extractInterstitialConfig(link: PrismaLink): InterstitialFormData {
  // Parse testimonials from JSON
  let testimonials: Testimonial[] = []
  if (link.testimonials && typeof link.testimonials === "object") {
    try {
      // Handle both array directly or wrapped in object
      // Use unknown as intermediate type for safe casting
      testimonials = Array.isArray(link.testimonials)
        ? (link.testimonials as unknown as Testimonial[])
        : []
    } catch {
      testimonials = []
    }
  }

  return {
    // Optional string fields - use empty string if not set
    logo: link.interstitialLogo ?? "",
    bgImage: link.interstitialBgImage ?? "",
    privacyPolicyUrl: link.privacyUrl ?? "",
    customCss: link.customCss ?? "",
    countdownRedirectUrl: link.countdownRedirectUrl ?? "",
    exitIntentMessage: link.exitIntentMessage ?? "",
    exitIntentOfferText: link.exitIntentOffer ?? "",

    // Required string fields - use defaults if null or empty
    headline: link.interstitialHeadline || DEFAULT_INTERSTITIAL_CONFIG.headline,
    description: link.interstitialDescription || DEFAULT_INTERSTITIAL_CONFIG.description,
    buttonText: link.interstitialButtonText || DEFAULT_INTERSTITIAL_CONFIG.buttonText,
    bgColor: link.interstitialBgColor || DEFAULT_INTERSTITIAL_CONFIG.bgColor,
    phoneLabel: link.phoneLabel || DEFAULT_INTERSTITIAL_CONFIG.phoneLabel,
    privacyCheckboxText: link.privacyText || DEFAULT_INTERSTITIAL_CONFIG.privacyCheckboxText,
    socialProofText: link.socialProofText || DEFAULT_INTERSTITIAL_CONFIG.socialProofText,

    // Theme - must be valid enum value
    theme: (link.interstitialTheme === "light" || link.interstitialTheme === "dark")
      ? link.interstitialTheme
      : DEFAULT_INTERSTITIAL_CONFIG.theme,

    // Numeric fields - use ?? to handle 0 correctly
    bgOverlayOpacity: link.interstitialBgOverlay ?? DEFAULT_INTERSTITIAL_CONFIG.bgOverlayOpacity,
    countdownSeconds: link.countdownSeconds ?? DEFAULT_INTERSTITIAL_CONFIG.countdownSeconds,
    socialProofCount: link.socialProofCount ?? DEFAULT_INTERSTITIAL_CONFIG.socialProofCount,

    // Boolean fields - direct assignment (DB defaults handle nulls)
    collectName: link.collectName,
    nameRequired: link.nameRequired,
    collectEmail: link.collectEmail,
    emailRequired: link.emailRequired,
    countdownEnabled: link.countdownEnabled,
    socialProofEnabled: link.socialProofEnabled,
    exitIntentEnabled: link.exitIntentEnabled,

    // Array fields - use empty array if null
    securityBadges: link.securityBadges ?? [],
    testimonials,
  }
}

/**
 * Convert CreateLinkRequest to Prisma create input
 */
export function createRequestToPrismaInput(
  request: CreateLinkRequest,
  userId: string,
  linkId: string
): Prisma.LinkCreateInput {
  const interstitial = request.interstitial

  // Clean phone number - remove formatting, keep only digits
  const cleanPhone = request.phone.replace(/\D/g, "")

  return {
    id: linkId,
    user: {
      connect: { id: userId },
    },
    slug: request.slug,
    destinationNumber: cleanPhone,
    messageTemplate: request.message,
    ghostMode: request.ghostMode,
    isActive: true,
    pixelId: request.pixelId || null,
    capiToken: request.capiToken || null,
    defaultUtmSource: request.utmSource || null,
    defaultUtmMedium: request.utmMedium || null,
    defaultUtmCampaign: request.utmCampaign || null,
    defaultUtmContent: request.utmContent || null,

    // Interstitial fields (only if provided)
    ...(interstitial && {
      interstitialLogo: interstitial.logo || null,
      interstitialHeadline: interstitial.headline || null,
      interstitialDescription: interstitial.description || null,
      interstitialButtonText: interstitial.buttonText || null,
      interstitialBgColor: interstitial.bgColor || null,
      interstitialBgImage: interstitial.bgImage || null,
      interstitialBgOverlay: interstitial.bgOverlayOpacity ?? null,
      interstitialTheme: interstitial.theme || null,
      collectName: interstitial.collectName ?? false,
      nameRequired: interstitial.nameRequired ?? false,
      collectEmail: interstitial.collectEmail ?? false,
      emailRequired: interstitial.emailRequired ?? false,
      phoneLabel: interstitial.phoneLabel || null,
      privacyUrl: interstitial.privacyPolicyUrl || null,
      privacyText: interstitial.privacyCheckboxText || null,
      customCss: interstitial.customCss || null,
      countdownEnabled: interstitial.countdownEnabled ?? false,
      countdownSeconds: interstitial.countdownSeconds ?? null,
      countdownRedirectUrl: interstitial.countdownRedirectUrl || null,
      socialProofEnabled: interstitial.socialProofEnabled ?? false,
      socialProofCount: interstitial.socialProofCount ?? null,
      socialProofText: interstitial.socialProofText || null,
      exitIntentEnabled: interstitial.exitIntentEnabled ?? false,
      exitIntentMessage: interstitial.exitIntentMessage || null,
      exitIntentOffer: interstitial.exitIntentOfferText || null,
      securityBadges: interstitial.securityBadges || [],
      testimonials: interstitial.testimonials?.length
        ? (interstitial.testimonials as unknown as Prisma.InputJsonValue)
        : Prisma.DbNull,
    }),
  }
}

/**
 * Convert partial update request to Prisma update input
 */
export function updateRequestToPrismaInput(
  request: Partial<{
    isActive: boolean
    ghostMode: boolean
    destinationNumber: string
    messageTemplate: string
    pixelId: string
    capiToken: string
    utmSource: string
    utmMedium: string
    utmCampaign: string
    utmContent: string
    interstitial: Partial<InterstitialFormData>
  }>
): Prisma.LinkUpdateInput {
  const update: Prisma.LinkUpdateInput = {}

  if (request.isActive !== undefined) update.isActive = request.isActive
  if (request.ghostMode !== undefined) update.ghostMode = request.ghostMode
  if (request.destinationNumber) update.destinationNumber = request.destinationNumber
  if (request.messageTemplate) update.messageTemplate = request.messageTemplate
  if (request.pixelId !== undefined) update.pixelId = request.pixelId || null
  if (request.capiToken !== undefined) update.capiToken = request.capiToken || null
  if (request.utmSource !== undefined) update.defaultUtmSource = request.utmSource || null
  if (request.utmMedium !== undefined) update.defaultUtmMedium = request.utmMedium || null
  if (request.utmCampaign !== undefined) update.defaultUtmCampaign = request.utmCampaign || null
  if (request.utmContent !== undefined) update.defaultUtmContent = request.utmContent || null

  // Interstitial updates
  const i = request.interstitial
  if (i) {
    if (i.logo !== undefined) update.interstitialLogo = i.logo || null
    if (i.headline !== undefined) update.interstitialHeadline = i.headline || null
    if (i.description !== undefined) update.interstitialDescription = i.description || null
    if (i.buttonText !== undefined) update.interstitialButtonText = i.buttonText || null
    if (i.bgColor !== undefined) update.interstitialBgColor = i.bgColor || null
    if (i.bgImage !== undefined) update.interstitialBgImage = i.bgImage || null
    if (i.bgOverlayOpacity !== undefined) update.interstitialBgOverlay = i.bgOverlayOpacity
    if (i.theme !== undefined) update.interstitialTheme = i.theme || null
    if (i.collectName !== undefined) update.collectName = i.collectName
    if (i.nameRequired !== undefined) update.nameRequired = i.nameRequired
    if (i.collectEmail !== undefined) update.collectEmail = i.collectEmail
    if (i.emailRequired !== undefined) update.emailRequired = i.emailRequired
    if (i.phoneLabel !== undefined) update.phoneLabel = i.phoneLabel || null
    if (i.privacyPolicyUrl !== undefined) update.privacyUrl = i.privacyPolicyUrl || null
    if (i.privacyCheckboxText !== undefined) update.privacyText = i.privacyCheckboxText || null
    if (i.customCss !== undefined) update.customCss = i.customCss || null
    if (i.countdownEnabled !== undefined) update.countdownEnabled = i.countdownEnabled
    if (i.countdownSeconds !== undefined) update.countdownSeconds = i.countdownSeconds
    if (i.countdownRedirectUrl !== undefined) update.countdownRedirectUrl = i.countdownRedirectUrl || null
    if (i.socialProofEnabled !== undefined) update.socialProofEnabled = i.socialProofEnabled
    if (i.socialProofCount !== undefined) update.socialProofCount = i.socialProofCount
    if (i.socialProofText !== undefined) update.socialProofText = i.socialProofText || null
    if (i.exitIntentEnabled !== undefined) update.exitIntentEnabled = i.exitIntentEnabled
    if (i.exitIntentMessage !== undefined) update.exitIntentMessage = i.exitIntentMessage || null
    if (i.exitIntentOfferText !== undefined) update.exitIntentOffer = i.exitIntentOfferText || null
    if (i.securityBadges !== undefined) update.securityBadges = i.securityBadges
    if (i.testimonials !== undefined) {
      update.testimonials = i.testimonials?.length
        ? (i.testimonials as unknown as Prisma.InputJsonValue)
        : Prisma.DbNull
    }
  }

  return update
}

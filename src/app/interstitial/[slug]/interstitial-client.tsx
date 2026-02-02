"use client"

/**
 * Interstitial Client Component
 * 
 * Handles form submission and rendering of the interstitial page.
 * Receives config from server component and manages client-side interactions.
 */

import * as React from "react"
import { InterstitialPage } from "@/features/interstitial"
import type { InterstitialConfig, InterstitialFormData } from "@/features/interstitial"
import type { InterstitialFormData as LinkInterstitialFormData } from "@/features/links/types/links.types"

interface InterstitialClientProps {
  linkId: string
  slug: string
  config: LinkInterstitialFormData
  destinationNumber: string
  messageTemplate: string
  utmParams: {
    source?: string
    medium?: string
    campaign?: string
    content?: string
    term?: string
  }
  defaultUtm: {
    source?: string
    medium?: string
    campaign?: string
    content?: string
  }
}

export function InterstitialClient({
  linkId,
  config,
  utmParams,
  defaultUtm,
}: InterstitialClientProps) {
  // Convert LinkInterstitialFormData to InterstitialConfig format
  // The config from extractInterstitialConfig already has all proper defaults applied
  const interstitialConfig: InterstitialConfig = {
    // Optional fields - convert empty string to undefined for cleaner rendering
    logo: config.logo || undefined,
    bgImage: config.bgImage || undefined,

    // Required string fields - pass through directly (already have defaults)
    headline: config.headline,
    description: config.description,
    buttonText: config.buttonText,
    bgColor: config.bgColor,
    phoneLabel: config.phoneLabel,
    privacyCheckboxText: config.privacyCheckboxText,
    socialProofText: config.socialProofText,

    // String fields with default empty - ensure string type
    privacyPolicyUrl: config.privacyPolicyUrl ?? "",
    customCss: config.customCss ?? "",
    countdownRedirectUrl: config.countdownRedirectUrl ?? "",
    exitIntentMessage: config.exitIntentMessage ?? "",
    exitIntentOfferText: config.exitIntentOfferText ?? "",

    // Numeric fields - pass through (already have defaults)
    bgOverlayOpacity: config.bgOverlayOpacity,
    countdownSeconds: config.countdownSeconds,
    socialProofCount: config.socialProofCount,

    // Boolean fields - pass through directly
    collectName: config.collectName,
    nameRequired: config.nameRequired,
    collectEmail: config.collectEmail,
    emailRequired: config.emailRequired,
    countdownEnabled: config.countdownEnabled,
    socialProofEnabled: config.socialProofEnabled,
    exitIntentEnabled: config.exitIntentEnabled,

    // Theme
    theme: config.theme,

    // Arrays - pass through directly
    securityBadges: config.securityBadges,
    testimonials: config.testimonials,
  }

  // Handle form submission
  const handleSubmit = async (formData: InterstitialFormData) => {
    try {
      // Merge UTM params - URL params take precedence over defaults
      const finalUtm = {
        source: utmParams.source || defaultUtm.source,
        medium: utmParams.medium || defaultUtm.medium,
        campaign: utmParams.campaign || defaultUtm.campaign,
        content: utmParams.content || defaultUtm.content,
        term: utmParams.term, // term has no default, only passed via URL
      }

      // Call leads API
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          linkId,
          phone: formData.phone,
          name: formData.name,
          email: formData.email,
          utmSource: finalUtm.source,
          utmMedium: finalUtm.medium,
          utmCampaign: finalUtm.campaign,
          utmContent: finalUtm.content,
          utmTerm: finalUtm.term,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || "Failed to submit form")
      }

      const data = await response.json()

      // Redirect to WhatsApp
      window.location.href = data.whatsappUrl
    } catch (error) {
      console.error("Error submitting lead:", error)
      throw error
    }
  }

  return (
    <div className="min-h-screen">
      <InterstitialPage
        config={interstitialConfig}
        onSubmit={handleSubmit}
        isPreview={false}
        className="min-h-screen"
      />
    </div>
  )
}

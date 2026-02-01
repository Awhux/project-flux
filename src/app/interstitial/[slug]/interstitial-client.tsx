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
  const interstitialConfig: InterstitialConfig = {
    logo: config.logo || undefined,
    headline: config.headline,
    description: config.description,
    buttonText: config.buttonText,
    bgColor: config.bgColor,
    bgImage: config.bgImage || undefined,
    bgOverlayOpacity: config.bgOverlayOpacity,
    theme: config.theme,
    collectName: config.collectName,
    nameRequired: config.nameRequired,
    collectEmail: config.collectEmail,
    emailRequired: config.emailRequired,
    phoneLabel: config.phoneLabel,
    privacyPolicyUrl: config.privacyPolicyUrl || "",
    privacyCheckboxText: config.privacyCheckboxText,
    customCss: config.customCss || "",
    countdownEnabled: config.countdownEnabled,
    countdownSeconds: config.countdownSeconds,
    countdownRedirectUrl: config.countdownRedirectUrl || "",
    socialProofEnabled: config.socialProofEnabled,
    socialProofCount: config.socialProofCount,
    socialProofText: config.socialProofText,
    exitIntentEnabled: config.exitIntentEnabled,
    exitIntentMessage: config.exitIntentMessage || "",
    exitIntentOfferText: config.exitIntentOfferText || "",
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

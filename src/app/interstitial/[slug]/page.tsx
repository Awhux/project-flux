/**
 * Interstitial Page
 * 
 * Server component that fetches link configuration and renders
 * the interstitial page for lead capture.
 * 
 * Route: /interstitial/:slug
 */

import { notFound } from "next/navigation"
import { prisma } from "@/features/database/server"
import { extractInterstitialConfig } from "@/features/links/services/link-mapper.service"
import { InterstitialClient } from "./interstitial-client"

interface InterstitialPageParams {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function InterstitialPage({ params, searchParams }: InterstitialPageParams) {
  const { slug } = await params
  const search = await searchParams

  // Fetch link from database
  const link = await prisma.link.findUnique({
    where: { slug },
  })

  // Return 404 if not found or inactive
  if (!link || !link.isActive) {
    notFound()
  }

  // Extract interstitial config from link
  const config = extractInterstitialConfig(link)

  // Extract UTM params from URL
  const utmParams = {
    source: typeof search.utm_source === "string" ? search.utm_source : undefined,
    medium: typeof search.utm_medium === "string" ? search.utm_medium : undefined,
    campaign: typeof search.utm_campaign === "string" ? search.utm_campaign : undefined,
    content: typeof search.utm_content === "string" ? search.utm_content : undefined,
  }

  return (
    <InterstitialClient
      linkId={link.id}
      slug={slug}
      config={config}
      destinationNumber={link.destinationNumber}
      messageTemplate={link.messageTemplate}
      utmParams={utmParams}
      defaultUtm={{
        source: link.defaultUtmSource || undefined,
        medium: link.defaultUtmMedium || undefined,
        campaign: link.defaultUtmCampaign || undefined,
        content: link.defaultUtmContent || undefined,
      }}
    />
  )
}

/**
 * Generate metadata for the interstitial page
 */
export async function generateMetadata({ params }: InterstitialPageParams) {
  const { slug } = await params

  const link = await prisma.link.findUnique({
    where: { slug },
    select: {
      interstitialHeadline: true,
      interstitialDescription: true,
    },
  })

  return {
    title: link?.interstitialHeadline || "Continue para WhatsApp",
    description: link?.interstitialDescription || "Confirme suas informações para continuar",
  }
}

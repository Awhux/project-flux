/**
 * Link Redirect Handler
 * 
 * GET /l/:slug - Redirect short links to WhatsApp or interstitial page
 * 
 * Flow:
 * 1. Look up link by slug
 * 2. Record click event with analytics data
 * 3. If Ghost Mode: redirect to interstitial page
 * 4. If not Ghost Mode: redirect directly to WhatsApp
 */

import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/features/database/server"
import {
  detectDeviceType,
  buildWhatsAppUrl,
  extractUtmFromSearchParams,
  buildUtmQueryString,
} from "@/features/links/services"
import { recordClick, getClientIp } from "@/features/analytics/services"
import { sendFacebookEventAsync } from "@/features/facebook"
import { APP_URL } from "@/utils/app/links"

interface RouteParams {
  params: Promise<{ slug: string }>
}

/**
 * GET /l/:slug
 * Redirect handler for short links
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params

  try {
    // Get link from database
    const link = await prisma.link.findUnique({
      where: { slug },
    })

    // Link not found
    if (!link) {
      return NextResponse.redirect(new URL("/404", APP_URL), { status: 302 })
    }

    // Link is inactive
    if (!link.isActive) {
      return NextResponse.redirect(new URL("/link-inactive", APP_URL), { status: 302 })
    }

    // Extract request metadata for analytics
    const headersList = await headers()
    const ipAddress = getClientIp(headersList, request)
    const userAgent = headersList.get("user-agent")
    const referrer = headersList.get("referer")

    // Extract UTM params from query string
    const { searchParams } = new URL(request.url)
    const utmParams = extractUtmFromSearchParams(searchParams)

    // Use default UTM values if not provided in URL
    const finalUtm = {
      source: utmParams.source || link.defaultUtmSource || undefined,
      medium: utmParams.medium || link.defaultUtmMedium || undefined,
      campaign: utmParams.campaign || link.defaultUtmCampaign || undefined,
      content: utmParams.content || link.defaultUtmContent || undefined,
      term: utmParams.term || undefined,
    }

    // Extract Facebook tracking params
    const fbp = searchParams.get("_fbp") || undefined
    const fbc = searchParams.get("_fbc") || undefined

    // Detect device type
    const device = detectDeviceType(userAgent)

    // Record click event - errors are logged but don't block redirect
    try {
      await recordClick(link.id, link.userId, {
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        referrer: referrer || null,
        device,
        utmSource: finalUtm.source || null,
        utmMedium: finalUtm.medium || null,
        utmCampaign: finalUtm.campaign || null,
        utmContent: finalUtm.content || null,
        utmTerm: finalUtm.term || null,
        fbp: fbp || null,
        fbc: fbc || null,
      })
    } catch (clickError) {
      // Log error but don't block redirect - user experience is priority
      console.error("Failed to record click:", clickError)
    }

    // Send Facebook CAPI event (fire-and-forget - doesn't block redirect)
    if (link.pixelId && link.capiToken) {
      sendFacebookEventAsync(
        {
          pixelId: link.pixelId,
          accessToken: link.capiToken,
          eventName: "PageView",
          eventSourceUrl: request.url,
          userData: {
            clientIpAddress: ipAddress,
            clientUserAgent: userAgent,
            fbp: fbp,
            fbc: fbc,
          },
          eventId: link.id,
        },
        "Link Click CAPI"
      )
    }

    // Determine redirect destination
    if (link.ghostMode) {
      // Redirect to interstitial page with UTM params
      const utmQuery = buildUtmQueryString(finalUtm)
      const interstitialUrl = new URL(`/interstitial/${slug}${utmQuery}`, APP_URL)

      return NextResponse.redirect(interstitialUrl, { status: 302 })
    } else {
      // Redirect directly to WhatsApp
      const whatsappUrl = buildWhatsAppUrl(
        link.destinationNumber,
        link.messageTemplate,
        finalUtm
      )

      return NextResponse.redirect(whatsappUrl, { status: 302 })
    }
  } catch (error) {
    console.error("Error handling redirect:", error)

    // On error, try to provide a graceful fallback
    // In production, you might want to redirect to an error page instead
    return NextResponse.redirect(new URL("/error", APP_URL), { status: 302 })
  }
}


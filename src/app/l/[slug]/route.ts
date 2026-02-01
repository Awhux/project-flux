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
  generateClickId,
  detectDeviceType,
  buildWhatsAppUrl,
  extractUtmFromSearchParams,
  buildUtmQueryString,
} from "@/features/links/services"

interface RouteParams {
  params: Promise<{ slug: string }>
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

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

    // Record click event
    const clickId = generateClickId()
    await prisma.$transaction([
      prisma.click.create({
        data: {
          id: clickId,
          linkId: link.id,
          userId: link.userId,
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
        },
      }),
      prisma.link.update({
        where: { id: link.id },
        data: { clickCount: { increment: 1 } },
      }),
    ])

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

/**
 * Get client IP address from headers
 * Handles common proxy headers
 */
function getClientIp(
  headersList: Awaited<ReturnType<typeof headers>>,
  request: NextRequest
): string | null {
  // Check common proxy headers
  const forwardedFor = headersList.get("x-forwarded-for")
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwardedFor.split(",")[0].trim()
  }

  const realIp = headersList.get("x-real-ip")
  if (realIp) {
    return realIp
  }

  // Vercel/Cloudflare specific headers
  const cfConnectingIp = headersList.get("cf-connecting-ip")
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Fallback to request IP (might be localhost in development)
  return request.ip || null
}

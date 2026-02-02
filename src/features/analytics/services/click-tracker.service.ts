/**
 * Click Tracking Service
 * 
 * Shared service for recording link clicks across different routes.
 * Ensures consistent click tracking and analytics data collection.
 */

import { NextRequest } from "next/server"
import { headers } from "next/headers"
import type { DeviceType } from "@prisma/client"
import { prisma } from "@/features/database/server"
import { generateClickId } from "@/features/links/services"

/**
 * Click data to be recorded
 */
export interface ClickData {
  ipAddress: string | null
  userAgent: string | null
  referrer: string | null
  device: DeviceType
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmContent: string | null
  utmTerm: string | null
  fbp: string | null
  fbc: string | null
}

/**
 * Record a click event in the database
 * 
 * Uses a transaction to ensure both the click record and counter are updated atomically.
 * This function handles both the Click table insertion and the Link clickCount increment.
 * 
 * @param linkId - ID of the link being clicked
 * @param userId - ID of the user who owns the link
 * @param clickData - Analytics data about the click (device, UTM params, etc.)
 * @throws Error if the database transaction fails
 */
export async function recordClick(
  linkId: string,
  userId: string,
  clickData: ClickData
): Promise<void> {
  const clickId = generateClickId()

  // Use interactive transaction for better error handling
  await prisma.$transaction(async (tx) => {
    // Create the click record
    await tx.click.create({
      data: {
        id: clickId,
        linkId,
        userId,
        ipAddress: clickData.ipAddress,
        userAgent: clickData.userAgent,
        referrer: clickData.referrer,
        device: clickData.device,
        utmSource: clickData.utmSource,
        utmMedium: clickData.utmMedium,
        utmCampaign: clickData.utmCampaign,
        utmContent: clickData.utmContent,
        utmTerm: clickData.utmTerm,
        fbp: clickData.fbp,
        fbc: clickData.fbc,
      },
    })

    // Increment the click counter
    await tx.link.update({
      where: { id: linkId },
      data: { clickCount: { increment: 1 } },
    })
  })
}

/**
 * Get client IP address from request headers
 * 
 * Checks common proxy headers in order of precedence:
 * 1. x-forwarded-for (standard proxy header, may contain multiple IPs)
 * 2. x-real-ip (nginx/proxy header)
 * 3. cf-connecting-ip (Cloudflare/Vercel header)
 * 
 * @param headersList - Next.js headers object
 * @param request - Next.js request object (unused but kept for future extensibility)
 * @returns Client IP address or null if not available
 */
export function getClientIp(
  headersList: Awaited<ReturnType<typeof headers>>,
  request: NextRequest
): string | null {
  // Check common proxy headers
  const forwardedFor = headersList.get("x-forwarded-for")
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first one (client)
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

  // Fallback - no IP available
  return null
}

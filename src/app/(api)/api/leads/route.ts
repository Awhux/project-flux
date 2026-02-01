/**
 * Leads API Route
 * 
 * POST /api/leads - Capture a lead from interstitial form
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/features/database/server"
import {
  generateLeadId,
  generateRequestId,
  buildWhatsAppUrl,
} from "@/features/links/services"
import type {
  CaptureLeadRequest,
  CaptureLeadResponse,
  ApiErrorResponse,
} from "@/features/links/types/api.types"
import { z } from "zod"

const captureLeadSchema = z.object({
  linkId: z.string().min(1, "Link ID is required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[\d\s()+-]+$/, "Invalid phone format"),
  name: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  utmSource: z.string().max(255).optional(),
  utmMedium: z.string().max(255).optional(),
  utmCampaign: z.string().max(255).optional(),
  utmContent: z.string().max(255).optional(),
})

/**
 * POST /api/leads
 * Capture a lead from interstitial page form submission
 * 
 * This endpoint is PUBLIC (no auth required) because it's called
 * from the interstitial page which is accessed by end users.
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    // Parse request body
    let body: CaptureLeadRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { error: { message: "Invalid JSON body", code: "INVALID_BODY" }, requestId },
        { status: 400 }
      )
    }

    // Validate input
    const validationResult = captureLeadSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: {
            message: "Validation failed",
            code: "VALIDATION_ERROR",
            details: validationResult.error.flatten(),
          },
          requestId,
        },
        { status: 400 }
      )
    }

    const { linkId, phone, name, email, utmSource, utmMedium, utmCampaign, utmContent } =
      validationResult.data

    // Get link from database
    const link = await prisma.link.findUnique({
      where: { id: linkId },
    })

    if (!link) {
      return NextResponse.json<ApiErrorResponse>(
        { error: { message: "Link not found", code: "NOT_FOUND" }, requestId },
        { status: 404 }
      )
    }

    // Check if link is active
    if (!link.isActive) {
      return NextResponse.json<ApiErrorResponse>(
        { error: { message: "Link is not active", code: "LINK_INACTIVE" }, requestId },
        { status: 410 }
      )
    }

    // Clean phone number (remove formatting)
    const cleanPhone = phone.replace(/\D/g, "")

    // Generate lead ID
    const leadId = generateLeadId()

    // Create lead in database and increment counter
    await prisma.$transaction([
      prisma.lead.create({
        data: {
          id: leadId,
          linkId,
          userId: link.userId,
          phone: cleanPhone,
          name: name || null,
          email: email || null,
          utmSource: utmSource || link.defaultUtmSource || null,
          utmMedium: utmMedium || link.defaultUtmMedium || null,
          utmCampaign: utmCampaign || link.defaultUtmCampaign || null,
          utmContent: utmContent || link.defaultUtmContent || null,
        },
      }),
      prisma.link.update({
        where: { id: linkId },
        data: { leadCount: { increment: 1 } },
      }),
    ])

    // Build WhatsApp URL with UTM params
    const whatsappUrl = buildWhatsAppUrl(
      link.destinationNumber,
      link.messageTemplate,
      {
        source: utmSource || link.defaultUtmSource || undefined,
        medium: utmMedium || link.defaultUtmMedium || undefined,
        campaign: utmCampaign || link.defaultUtmCampaign || undefined,
        content: utmContent || link.defaultUtmContent || undefined,
      }
    )

    const response: CaptureLeadResponse = {
      success: true,
      leadId,
      whatsappUrl,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error capturing lead:", error)
    return NextResponse.json<ApiErrorResponse>(
      {
        error: {
          message: "Failed to capture lead",
          code: "INTERNAL_ERROR",
          details: error instanceof Error ? { message: error.message } : undefined,
        },
        requestId,
      },
      { status: 500 }
    )
  }
}

/**
 * Leads API Route
 * 
 * GET /api/leads - List leads for authenticated user
 * POST /api/leads - Capture a lead from interstitial form
 */

import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/features/database/server"
import { getUserSession } from "@/features/auth/application/services/session.service"
import {
  generateLeadId,
  generateRequestId,
  buildWhatsAppUrl,
  detectDeviceType,
} from "@/features/links/services"
import { recordClick, getClientIp } from "@/features/analytics/services"
import {
  findLeadsByUserId,
  getLeadStats,
} from "@/features/leads/infrastructure"
import { prismaLeadToApiLead } from "@/features/leads/services"
import type {
  CaptureLeadRequest,
  CaptureLeadResponse,
  ApiErrorResponse,
} from "@/features/links/types/api.types"
import type {
  ListLeadsResponse,
  ListLeadsQuery,
} from "@/features/leads/types"
import { z } from "zod"

const ITEMS_PER_PAGE = 50

/**
 * GET /api/leads
 * List leads for the authenticated user with filtering and pagination
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    // Get authenticated user
    const session = await getUserSession()
    if (!session?.user?.id) {
      return NextResponse.json<ApiErrorResponse>(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" }, requestId },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const query: ListLeadsQuery = {
      linkId: searchParams.get("linkId") || undefined,
      dateRange: (searchParams.get("dateRange") as ListLeadsQuery["dateRange"]) || "all",
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || String(ITEMS_PER_PAGE), 10),
    }

    // Validate pagination
    const page = Math.max(1, query.page || 1)
    const limit = Math.min(100, Math.max(1, query.limit || ITEMS_PER_PAGE))
    const skip = (page - 1) * limit

    // Fetch leads and stats in parallel
    const [{ leads, total }, stats] = await Promise.all([
      findLeadsByUserId({
        userId,
        linkId: query.linkId,
        dateRange: query.dateRange,
        pagination: { skip, take: limit },
      }),
      getLeadStats({
        userId,
        linkId: query.linkId,
      }),
    ])

    // Transform to API format
    const apiLeads = leads.map(prismaLeadToApiLead)

    const response: ListLeadsResponse = {
      leads: apiLeads,
      stats: {
        totalLeads: stats.totalLeads,
        leadsThisWeek: stats.leadsThisWeek,
        leadsThisMonth: stats.leadsThisMonth,
      },
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error listing leads:", error)
    return NextResponse.json<ApiErrorResponse>(
      {
        error: {
          message: "Failed to list leads",
          code: "INTERNAL_ERROR",
          details: error instanceof Error ? { message: error.message } : undefined,
        },
        requestId,
      },
      { status: 500 }
    )
  }
}

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
  utmTerm: z.string().max(255).optional(),
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

    const { linkId, phone, name, email, utmSource, utmMedium, utmCampaign, utmContent, utmTerm } =
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

    // Extract request metadata for click tracking
    const headersList = await headers()
    const ipAddress = getClientIp(headersList, request)
    const userAgent = headersList.get("user-agent")
    const referrer = headersList.get("referer")

    // Detect device type
    const device = detectDeviceType(userAgent)

    // Extract Facebook tracking params from query string
    const { searchParams } = new URL(request.url)
    const fbp = searchParams.get("_fbp") || undefined
    const fbc = searchParams.get("_fbc") || undefined

    // Use default UTM values if not provided
    const finalUtm = {
      source: utmSource || link.defaultUtmSource || undefined,
      medium: utmMedium || link.defaultUtmMedium || undefined,
      campaign: utmCampaign || link.defaultUtmCampaign || undefined,
      content: utmContent || link.defaultUtmContent || undefined,
      term: utmTerm || undefined,
    }

    // Clean phone number (remove formatting)
    const cleanPhone = phone.replace(/\D/g, "")

    // Generate lead ID
    const leadId = generateLeadId()

    // Record click event - errors are logged but don't block lead capture
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
      // Log error but don't block lead capture - user experience is priority
      console.error("Failed to record click:", clickError)
    }

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
          utmSource: finalUtm.source || null,
          utmMedium: finalUtm.medium || null,
          utmCampaign: finalUtm.campaign || null,
          utmContent: finalUtm.content || null,
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
      finalUtm
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

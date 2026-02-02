/**
 * Analytics API Route
 *
 * GET /api/analytics - Get analytics data for authenticated user
 */

import { NextRequest, NextResponse } from "next/server"
import { getUserSession } from "@/features/auth/application/services/session.service"
import { analyticsService } from "@/features/analytics/domain"
import { generateRequestId } from "@/features/analytics/services"
import { prisma } from "@/features/database/server"
import type { DateRange } from "@/features/analytics/types"

interface ApiErrorResponse {
  error: {
    message: string
    code: string
    details?: Record<string, unknown>
  }
  requestId: string
}

const VALID_DATE_RANGES: DateRange[] = ["7", "30", "90"]

/**
 * GET /api/analytics
 * Get analytics data for the authenticated user
 *
 * Query Parameters:
 * - dateRange (required): "7" | "30" | "90"
 * - linkId (optional): specific link ID to filter by
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    // Get authenticated user
    const session = await getUserSession()
    if (!session?.user?.id) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: { message: "Unauthorized", code: "UNAUTHORIZED" },
          requestId,
        },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get("dateRange") as DateRange | null
    const linkId = searchParams.get("linkId")

    // Validate dateRange
    if (!dateRange || !VALID_DATE_RANGES.includes(dateRange)) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: {
            message: "Invalid or missing dateRange parameter. Must be '7', '30', or '90'",
            code: "VALIDATION_ERROR",
          },
          requestId,
        },
        { status: 400 }
      )
    }

    // If linkId is provided, verify ownership
    if (linkId) {
      const link = await prisma.link.findUnique({
        where: { id: linkId },
        select: { userId: true },
      })

      if (!link) {
        return NextResponse.json<ApiErrorResponse>(
          {
            error: { message: "Link not found", code: "NOT_FOUND" },
            requestId,
          },
          { status: 404 }
        )
      }

      if (link.userId !== userId) {
        return NextResponse.json<ApiErrorResponse>(
          {
            error: { message: "Forbidden", code: "FORBIDDEN" },
            requestId,
          },
          { status: 403 }
        )
      }
    }

    // Get analytics data
    const analyticsData = await analyticsService.getAnalytics({
      userId,
      linkId: linkId || undefined,
      dateRange,
    })

    // Return response with cache control headers
    // Cache for 30 seconds, private (user-specific data)
    return NextResponse.json(analyticsData, {
      headers: {
        "Cache-Control": "private, max-age=30",
      },
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json<ApiErrorResponse>(
      {
        error: {
          message: "Failed to fetch analytics",
          code: "INTERNAL_ERROR",
          details:
            error instanceof Error ? { message: error.message } : undefined,
        },
        requestId,
      },
      { status: 500 }
    )
  }
}

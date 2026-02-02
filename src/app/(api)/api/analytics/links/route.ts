/**
 * Analytics Links API Route
 *
 * GET /api/analytics/links - Get user's links for analytics filter dropdown
 */

import { NextResponse } from "next/server"
import { getUserSession } from "@/features/auth/application/services/session.service"
import { analyticsService } from "@/features/analytics/domain"
import { generateRequestId } from "@/features/analytics/services"

interface ApiErrorResponse {
  error: {
    message: string
    code: string
  }
  requestId: string
}

interface LinkOption {
  id: string
  slug: string
  clickCount: number
}

interface LinksResponse {
  links: LinkOption[]
}

/**
 * GET /api/analytics/links
 * Get user's links for filter dropdown
 */
export async function GET() {
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

    // Get user's links
    const links = await analyticsService.getUserLinks(userId)

    const response: LinksResponse = { links }

    // Cache for 60 seconds since links don't change frequently
    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "private, max-age=60",
      },
    })
  } catch (error) {
    console.error("Error fetching analytics links:", error)
    return NextResponse.json<ApiErrorResponse>(
      {
        error: {
          message: "Failed to fetch links",
          code: "INTERNAL_ERROR",
        },
        requestId,
      },
      { status: 500 }
    )
  }
}

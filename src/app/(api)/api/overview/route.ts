import { NextRequest, NextResponse } from "next/server"
import { getUserSession } from "@/features/auth/application/services/session.service"
import { overviewService } from "@/features/overview/services/overview.service"
import { generateRequestId } from "@/features/analytics/services/id-generator.service"

interface ApiErrorResponse {
  error: {
    message: string
    code: string
    details?: Record<string, unknown>
  }
  requestId: string
}

const VALID_DATE_RANGES = ["7", "30", "90"]

export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    // 1. Authenticate
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

    // 2. Parse Query Params
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get("dateRange")

    // 3. Validate
    if (!dateRange || !VALID_DATE_RANGES.includes(dateRange)) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: {
            message: "Invalid or missing dateRange. Must be '7', '30', or '90'",
            code: "VALIDATION_ERROR"
          },
          requestId,
        },
        { status: 400 }
      )
    }

    // 4. Fetch Data
    const data = await overviewService.getOverviewData(
      session.user.id,
      dateRange as "7" | "30" | "90",
      requestId
    )

    // 5. Return Response
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "private, max-age=30",
      },
    })
  } catch (error) {
    console.error("Error fetching overview data:", error)
    return NextResponse.json<ApiErrorResponse>(
      {
        error: {
          message: "Failed to fetch overview data",
          code: "INTERNAL_ERROR",
          details: error instanceof Error ? { message: error.message } : undefined,
        },
        requestId,
      },
      { status: 500 }
    )
  }
}

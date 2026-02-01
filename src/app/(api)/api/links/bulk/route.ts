/**
 * Bulk Links Operations API Route
 * 
 * POST /api/links/bulk - Perform bulk operations on links
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/features/database/server"
import { getUserSession } from "@/features/auth/application/services/session.service"
import { generateRequestId } from "@/features/links/services"
import type {
  BulkOperationRequest,
  BulkOperationResponse,
  ApiErrorResponse,
} from "@/features/links/types/api.types"
import { z } from "zod"

const bulkOperationSchema = z.object({
  action: z.enum(["delete", "enable", "disable"]),
  ids: z.array(z.string()).min(1, "At least one ID is required").max(100, "Maximum 100 IDs allowed"),
})

/**
 * POST /api/links/bulk
 * Perform bulk operations on links
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    let body: BulkOperationRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { error: { message: "Invalid JSON body", code: "INVALID_BODY" }, requestId },
        { status: 400 }
      )
    }

    // Validate input
    const validationResult = bulkOperationSchema.safeParse(body)
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

    const { action, ids } = validationResult.data

    // Verify ownership of all links
    const links = await prisma.link.findMany({
      where: {
        id: { in: ids },
        userId, // Only get links owned by this user
      },
      select: { id: true },
    })

    const ownedIds = links.map((link) => link.id)
    const notOwnedIds = ids.filter((id) => !ownedIds.includes(id))

    if (notOwnedIds.length > 0) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: {
            message: "Some links not found or not owned by user",
            code: "FORBIDDEN",
            details: { notFound: notOwnedIds },
          },
          requestId,
        },
        { status: 403 }
      )
    }

    // Perform bulk operation
    let affectedCount = 0
    const affectedIds: string[] = []

    switch (action) {
      case "delete": {
        // Delete all links (cascades to clicks and leads)
        const result = await prisma.link.deleteMany({
          where: {
            id: { in: ownedIds },
            userId,
          },
        })
        affectedCount = result.count
        affectedIds.push(...ownedIds.slice(0, result.count))
        break
      }

      case "enable": {
        // Enable all links
        const result = await prisma.link.updateMany({
          where: {
            id: { in: ownedIds },
            userId,
          },
          data: { isActive: true },
        })
        affectedCount = result.count
        affectedIds.push(...ownedIds.slice(0, result.count))
        break
      }

      case "disable": {
        // Disable all links
        const result = await prisma.link.updateMany({
          where: {
            id: { in: ownedIds },
            userId,
          },
          data: { isActive: false },
        })
        affectedCount = result.count
        affectedIds.push(...ownedIds.slice(0, result.count))
        break
      }
    }

    const response: BulkOperationResponse = {
      success: true,
      affectedCount,
      affectedIds,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error performing bulk operation:", error)
    return NextResponse.json<ApiErrorResponse>(
      {
        error: {
          message: "Failed to perform bulk operation",
          code: "INTERNAL_ERROR",
          details: error instanceof Error ? { message: error.message } : undefined,
        },
        requestId,
      },
      { status: 500 }
    )
  }
}

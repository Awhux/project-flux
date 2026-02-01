/**
 * Individual Link API Route
 * 
 * GET /api/links/:id - Get a single link
 * PATCH /api/links/:id - Update a link
 * DELETE /api/links/:id - Delete a link
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/features/database/server"
import { getUserSession } from "@/features/auth/application/services/session.service"
import {
  prismaLinkToApiLink,
  updateRequestToPrismaInput,
  generateRequestId,
} from "@/features/links/services"
import type {
  GetLinkResponse,
  UpdateLinkResponse,
  DeleteLinkResponse,
  UpdateLinkRequest,
  ApiErrorResponse,
} from "@/features/links/types/api.types"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/links/:id
 * Get a single link by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const requestId = generateRequestId()
  const { id } = await params

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

    // Get link from database
    const link = await prisma.link.findUnique({
      where: { id },
    })

    if (!link) {
      return NextResponse.json<ApiErrorResponse>(
        { error: { message: "Link not found", code: "NOT_FOUND" }, requestId },
        { status: 404 }
      )
    }

    // Check ownership
    if (link.userId !== userId) {
      return NextResponse.json<ApiErrorResponse>(
        { error: { message: "Forbidden", code: "FORBIDDEN" }, requestId },
        { status: 403 }
      )
    }

    // Convert to API format
    const apiLink = prismaLinkToApiLink(link)

    const response: GetLinkResponse = { link: apiLink }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error getting link:", error)
    return NextResponse.json<ApiErrorResponse>(
      {
        error: {
          message: "Failed to get link",
          code: "INTERNAL_ERROR",
          details: error instanceof Error ? { message: error.message } : undefined,
        },
        requestId,
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/links/:id
 * Update a link
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const requestId = generateRequestId()
  const { id } = await params

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

    // Get existing link
    const existingLink = await prisma.link.findUnique({
      where: { id },
    })

    if (!existingLink) {
      return NextResponse.json<ApiErrorResponse>(
        { error: { message: "Link not found", code: "NOT_FOUND" }, requestId },
        { status: 404 }
      )
    }

    // Check ownership
    if (existingLink.userId !== userId) {
      return NextResponse.json<ApiErrorResponse>(
        { error: { message: "Forbidden", code: "FORBIDDEN" }, requestId },
        { status: 403 }
      )
    }

    // Parse request body
    let body: UpdateLinkRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { error: { message: "Invalid JSON body", code: "INVALID_BODY" }, requestId },
        { status: 400 }
      )
    }

    // Convert to Prisma input
    const updateData = updateRequestToPrismaInput(body)

    // Update link in database
    const updatedLink = await prisma.link.update({
      where: { id },
      data: updateData,
    })

    // Convert to API format
    const apiLink = prismaLinkToApiLink(updatedLink)

    const response: UpdateLinkResponse = { link: apiLink }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error updating link:", error)
    return NextResponse.json<ApiErrorResponse>(
      {
        error: {
          message: "Failed to update link",
          code: "INTERNAL_ERROR",
          details: error instanceof Error ? { message: error.message } : undefined,
        },
        requestId,
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/links/:id
 * Delete a link (cascades to clicks and leads)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const requestId = generateRequestId()
  const { id } = await params

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

    // Get existing link
    const existingLink = await prisma.link.findUnique({
      where: { id },
    })

    if (!existingLink) {
      return NextResponse.json<ApiErrorResponse>(
        { error: { message: "Link not found", code: "NOT_FOUND" }, requestId },
        { status: 404 }
      )
    }

    // Check ownership
    if (existingLink.userId !== userId) {
      return NextResponse.json<ApiErrorResponse>(
        { error: { message: "Forbidden", code: "FORBIDDEN" }, requestId },
        { status: 403 }
      )
    }

    // Delete link (cascades to clicks and leads due to onDelete: Cascade in schema)
    await prisma.link.delete({
      where: { id },
    })

    const response: DeleteLinkResponse = {
      success: true,
      deletedId: id,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error deleting link:", error)
    return NextResponse.json<ApiErrorResponse>(
      {
        error: {
          message: "Failed to delete link",
          code: "INTERNAL_ERROR",
          details: error instanceof Error ? { message: error.message } : undefined,
        },
        requestId,
      },
      { status: 500 }
    )
  }
}

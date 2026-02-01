/**
 * Links API Route
 * 
 * GET /api/links - List links with pagination and filtering
 * POST /api/links - Create a new link
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/features/database/server"
import { getUserSession } from "@/features/auth/application/services/session.service"
import {
  prismaLinkToApiLink,
  createRequestToPrismaInput,
  generateLinkId,
  generateRequestId,
} from "@/features/links/services"
import { linkFormSchema } from "@/features/links/schemas"
import type {
  ListLinksResponse,
  CreateLinkResponse,
  CreateLinkRequest,
  ApiErrorResponse,
  ListLinksQuery,
} from "@/features/links/types/api.types"
import type { Prisma } from "@prisma/client"

const ITEMS_PER_PAGE = 10

/**
 * GET /api/links
 * List links for the authenticated user
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
    const query: ListLinksQuery = {
      search: searchParams.get("search") || undefined,
      status: (searchParams.get("status") as ListLinksQuery["status"]) || "all",
      sortBy: (searchParams.get("sortBy") as ListLinksQuery["sortBy"]) || "newest",
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || String(ITEMS_PER_PAGE), 10),
    }

    // Build where clause
    const where: Prisma.LinkWhereInput = {
      userId,
    }

    // Search filter
    if (query.search) {
      where.OR = [
        { slug: { contains: query.search, mode: "insensitive" } },
        { messageTemplate: { contains: query.search, mode: "insensitive" } },
        { destinationNumber: { contains: query.search } },
      ]
    }

    // Status filter
    if (query.status === "active") {
      where.isActive = true
    } else if (query.status === "inactive") {
      where.isActive = false
    }

    // Build orderBy
    let orderBy: Prisma.LinkOrderByWithRelationInput = { createdAt: "desc" }
    switch (query.sortBy) {
      case "oldest":
        orderBy = { createdAt: "asc" }
        break
      case "most-clicks":
        orderBy = { clickCount: "desc" }
        break
      case "least-clicks":
        orderBy = { clickCount: "asc" }
        break
      case "a-z":
        orderBy = { slug: "asc" }
        break
      case "z-a":
        orderBy = { slug: "desc" }
        break
    }

    // Get total count for pagination
    const totalItems = await prisma.link.count({ where })

    // Get paginated links
    const page = query.page || 1
    const limit = query.limit || ITEMS_PER_PAGE
    const skip = (page - 1) * limit

    const links = await prisma.link.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    })

    // Get stats for all user links
    const allUserLinks = await prisma.link.findMany({
      where: { userId },
      select: {
        id: true,
        clickCount: true,
        isActive: true,
      },
    })

    const totalLinks = allUserLinks.length
    const totalClicks = allUserLinks.reduce((sum, link) => sum + link.clickCount, 0)
    const activeLinks = allUserLinks.filter((link) => link.isActive).length
    const avgClickRate = totalLinks > 0 ? Math.min((totalClicks / totalLinks) * 10 / 100, 100) : 0

    // Convert to API format
    const apiLinks = links.map(prismaLinkToApiLink)

    const response: ListLinksResponse = {
      links: apiLinks,
      stats: {
        totalLinks,
        totalClicks,
        activeLinks,
        avgClickRate,
      },
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error listing links:", error)
    return NextResponse.json<ApiErrorResponse>(
      {
        error: {
          message: "Failed to list links",
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
 * POST /api/links
 * Create a new link
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
    let body: CreateLinkRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json<ApiErrorResponse>(
        { error: { message: "Invalid JSON body", code: "INVALID_BODY" }, requestId },
        { status: 400 }
      )
    }

    // Validate input
    const validationResult = linkFormSchema.safeParse(body)
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

    // Check if slug is unique
    const existingLink = await prisma.link.findUnique({
      where: { slug: body.slug },
    })

    if (existingLink) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: {
            message: "A link with this slug already exists",
            code: "DUPLICATE_SLUG",
          },
          requestId,
        },
        { status: 409 }
      )
    }

    // Generate unique ID
    const linkId = generateLinkId()

    // Create link in database
    const prismaInput = createRequestToPrismaInput(body, userId, linkId)
    const createdLink = await prisma.link.create({
      data: prismaInput,
    })

    // Convert to API format
    const apiLink = prismaLinkToApiLink(createdLink)

    const response: CreateLinkResponse = {
      link: apiLink,
      shortUrl: apiLink.shortUrl,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating link:", error)
    return NextResponse.json<ApiErrorResponse>(
      {
        error: {
          message: "Failed to create link",
          code: "INTERNAL_ERROR",
          details: error instanceof Error ? { message: error.message } : undefined,
        },
        requestId,
      },
      { status: 500 }
    )
  }
}

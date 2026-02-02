"use server"

/**
 * Leads Repository
 * 
 * Data access layer for leads following DDD principles.
 * Handles all database queries related to leads with optimizations.
 */

import { prisma } from "@/features/database/server"
import type { Lead } from "@prisma/client"
import type { DateFilter } from "../types"

export interface FindLeadsByUserIdParams {
  userId: string
  linkId?: string
  dateRange?: DateFilter
  pagination: {
    skip: number
    take: number
  }
}

export interface FindLeadsByUserIdResult {
  leads: (Lead & { link: { slug: string } })[]
  total: number
}

export interface GetLeadStatsParams {
  userId: string
  linkId?: string
}

export interface LeadStatsResult {
  totalLeads: number
  leadsThisWeek: number
  leadsThisMonth: number
}

/**
 * Find leads by user ID with optional filtering
 * Optimized with join to avoid N+1 queries
 */
export async function findLeadsByUserId(
  params: FindLeadsByUserIdParams
): Promise<FindLeadsByUserIdResult> {
  const { userId, linkId, dateRange, pagination } = params

  // Build where clause
  const where: any = { userId }

  // Filter by link if specified
  if (linkId && linkId !== "all") {
    where.linkId = linkId
  }

  // Filter by date range if specified
  if (dateRange && dateRange !== "all") {
    const days = parseInt(dateRange, 10)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    where.convertedAt = { gte: cutoffDate }
  }

  // Execute queries in parallel for better performance
  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        link: {
          select: {
            slug: true,
          },
        },
      },
      orderBy: {
        convertedAt: "desc", // Uses composite index
      },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.lead.count({ where }),
  ])

  return { leads, total }
}

/**
 * Get lead statistics for a user
 * Calculates total leads, leads this week, and leads this month
 */
export async function getLeadStats(
  params: GetLeadStatsParams
): Promise<LeadStatsResult> {
  const { userId, linkId } = params

  // Base where clause
  const baseWhere: any = { userId }
  if (linkId && linkId !== "all") {
    baseWhere.linkId = linkId
  }

  // Calculate date boundaries
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - 7)

  const startOfMonth = new Date(now)
  startOfMonth.setDate(now.getDate() - 30)

  // Execute all count queries in parallel
  const [totalLeads, leadsThisWeek, leadsThisMonth] = await Promise.all([
    prisma.lead.count({ where: baseWhere }),
    prisma.lead.count({
      where: {
        ...baseWhere,
        convertedAt: { gte: startOfWeek },
      },
    }),
    prisma.lead.count({
      where: {
        ...baseWhere,
        convertedAt: { gte: startOfMonth },
      },
    }),
  ])

  return {
    totalLeads,
    leadsThisWeek,
    leadsThisMonth,
  }
}

/**
 * Find a single lead by ID
 */
export async function findLeadById(
  id: string,
  userId: string
): Promise<(Lead & { link: { slug: string } }) | null> {
  return prisma.lead.findFirst({
    where: {
      id,
      userId, // Ensure user can only access their own leads
    },
    include: {
      link: {
        select: {
          slug: true,
        },
      },
    },
  })
}

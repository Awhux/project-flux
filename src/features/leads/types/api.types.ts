/**
 * Leads API Types
 * 
 * Request and response types for the Leads REST API.
 * These types bridge the frontend components with the Prisma database models.
 */

import type { PaginationInfo } from "@/features/links/types/api.types"

// =============================================================================
// Request Types
// =============================================================================

/**
 * Query parameters for listing leads
 */
export interface ListLeadsQuery {
  linkId?: string
  dateRange?: "7" | "30" | "90" | "all"
  page?: number
  limit?: number
}

// =============================================================================
// Response Types
// =============================================================================

/**
 * API representation of a Lead
 */
export interface ApiLead {
  id: string
  name: string
  email: string | null
  phone: string
  linkId: string
  linkSlug: string
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmContent: string | null
  convertedAt: string // ISO 8601
}

/**
 * Statistics for leads
 */
export interface LeadStats {
  totalLeads: number
  leadsThisWeek: number
  leadsThisMonth: number
}

/**
 * Response for listing leads
 */
export interface ListLeadsResponse {
  leads: ApiLead[]
  stats: LeadStats
  pagination: PaginationInfo
}

// =============================================================================
// Error Types (reuse from links)
// =============================================================================

export type { ApiErrorResponse } from "@/features/links/types/api.types"

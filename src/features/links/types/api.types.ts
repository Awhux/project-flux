/**
 * Links API Types
 * 
 * Request and response types for the Links REST API.
 * These types bridge the frontend components with the Prisma database models.
 */

import type { Link as PrismaLink, DeviceType } from "@prisma/client"
import type { InterstitialFormData, LinkStats, StatusFilter, SortOption } from "./links.types"

// =============================================================================
// Request Types
// =============================================================================

/**
 * Request body for creating a new link
 */
export interface CreateLinkRequest {
  slug: string
  phone: string
  message: string
  ghostMode: boolean
  pixelId?: string
  capiToken?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  interstitial?: InterstitialFormData
}

/**
 * Request body for updating a link
 */
export interface UpdateLinkRequest {
  isActive?: boolean
  ghostMode?: boolean
  destinationNumber?: string
  messageTemplate?: string
  pixelId?: string
  capiToken?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  interstitial?: Partial<InterstitialFormData>
}

/**
 * Query parameters for listing links
 */
export interface ListLinksQuery {
  search?: string
  status?: StatusFilter
  sortBy?: SortOption
  page?: number
  limit?: number
}

/**
 * Request body for bulk operations
 */
export interface BulkOperationRequest {
  action: "delete" | "enable" | "disable"
  ids: string[]
}

/**
 * Request body for capturing a lead
 */
export interface CaptureLeadRequest {
  linkId: string
  phone: string
  name?: string
  email?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
}

// =============================================================================
// Response Types
// =============================================================================

/**
 * Pagination info for list responses
 */
export interface PaginationInfo {
  page: number
  limit: number
  totalPages: number
  totalItems: number
}

/**
 * API representation of a Link (flattened for frontend)
 */
export interface ApiLink {
  id: string
  slug: string
  destination: string
  message: string
  clicks: number
  leads: number
  active: boolean
  ghostMode: boolean
  pixelId?: string
  capiToken?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  interstitial?: InterstitialFormData
  shortUrl: string
  createdAt: string
  updatedAt: string
}

/**
 * Response for creating a link
 */
export interface CreateLinkResponse {
  link: ApiLink
  shortUrl: string
}

/**
 * Response for listing links
 */
export interface ListLinksResponse {
  links: ApiLink[]
  stats: LinkStats
  pagination: PaginationInfo
}

/**
 * Response for getting a single link
 */
export interface GetLinkResponse {
  link: ApiLink
}

/**
 * Response for updating a link
 */
export interface UpdateLinkResponse {
  link: ApiLink
}

/**
 * Response for deleting a link
 */
export interface DeleteLinkResponse {
  success: boolean
  deletedId: string
}

/**
 * Response for bulk operations
 */
export interface BulkOperationResponse {
  success: boolean
  affectedCount: number
  affectedIds: string[]
}

/**
 * Response for capturing a lead
 */
export interface CaptureLeadResponse {
  success: boolean
  leadId: string
  whatsappUrl: string
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  error: {
    message: string
    code?: string
    details?: Record<string, unknown>
  }
  requestId: string
}

// =============================================================================
// Click Tracking Types
// =============================================================================

/**
 * Data extracted from a click event
 */
export interface ClickEventData {
  linkId: string
  userId: string
  ipAddress?: string
  userAgent?: string
  referrer?: string
  device: DeviceType
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  country?: string
  city?: string
  fbp?: string
  fbc?: string
}

// =============================================================================
// Interstitial Page Types
// =============================================================================

/**
 * Data needed to render an interstitial page
 */
export interface InterstitialPageData {
  linkId: string
  slug: string
  destinationNumber: string
  messageTemplate: string
  config: InterstitialFormData
  utmParams: {
    source?: string
    medium?: string
    campaign?: string
    content?: string
  }
}

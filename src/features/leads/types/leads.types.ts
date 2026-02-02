/**
 * Leads feature domain types
 */

/**
 * Domain Lead type (used internally in the frontend)
 */
export interface Lead {
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
  convertedAt: Date
}

/**
 * Lead formatted for display in tables
 */
export interface DisplayLead extends Omit<Lead, "convertedAt"> {
  capturedAt: string
  capturedTime: string
}

/**
 * Lead filter options
 */
export interface LeadFilters {
  linkFilter: string
  dateFilter: DateFilter
}

/**
 * Date range filter type
 */
export type DateFilter = "all" | "7" | "30" | "90"

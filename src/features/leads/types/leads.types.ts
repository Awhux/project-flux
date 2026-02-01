/**
 * Leads feature types
 */

export interface Lead {
  id: string
  name: string
  email?: string
  phone: string
  link: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  capturedAt: Date
}

export interface DisplayLead extends Omit<Lead, "capturedAt"> {
  capturedAt: string
  capturedTime: string
}

export interface LeadFilters {
  linkFilter: string
  dateFilter: DateFilter
}

export type DateFilter = "all" | "7" | "30" | "90"

/**
 * Overview feature types
 */

export interface OverviewMetrics {
  totalClicks: number
  totalLeads: number
  conversionRate: number
  activeLinks: number
}

export interface OverviewTrends {
  clicks: { value: number; isPositive: boolean }
  leads: { value: number; isPositive: boolean }
  conversion: { value: number; isPositive: boolean }
  activeLinks: { value: number; isPositive: boolean }
}

export interface ClicksChartData {
  date: string
  clicks: number
}

export interface UtmChartData {
  source: string
  clicks: number
}

export interface UsageData {
  current: number
  limit: number
  planTier: "FREE" | "PRO" | "AGENCY"
}

// New types for Overview charts

export interface TopLinkData {
  id: string
  slug: string
  clicks: number
  trend: {
    value: number
    isPositive: boolean
  }
  sparkline: number[]
}

export interface FunnelData {
  totalClicks: number
  totalLeads: number
  totalConversions: number
}

export interface GeoDataPoint {
  region: string
  flag: string
  clicks: number
  percentage: number
}

export type ActivityType = "click" | "lead" | "whatsapp" | "link_created"

export interface ActivityData {
  id: string
  type: ActivityType
  linkSlug: string
  metadata?: {
    visitorName?: string
    utmSource?: string
    region?: string
  }
  timestamp: Date
}

export interface OverviewData {
  metrics: OverviewMetrics
  trends: OverviewTrends
  clicksChart: ClicksChartData[]
  utmChart: UtmChartData[]
  usage: UsageData
  // New chart data
  topLinks: TopLinkData[]
  funnel: FunnelData
  geoData: GeoDataPoint[]
  recentActivity: ActivityData[]
}

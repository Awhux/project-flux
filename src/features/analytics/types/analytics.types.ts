/**
 * Analytics feature types
 */

export interface AnalyticsMetrics {
  totalClicks: number
  totalLeads: number
  conversionRate: number
}

export interface AnalyticsTrends {
  clicks: { value: number; isPositive: boolean }
  leads: { value: number; isPositive: boolean }
  conversion: { value: number; isPositive: boolean }
}

export interface ClicksChartData {
  date: string
  clicks: number
}

export interface UtmChartData {
  source: string
  clicks: number
}

export interface DeviceChartData {
  device: string
  value: number
}

export type DateRange = "7" | "30" | "90"

export type UtmTab = "source" | "medium" | "campaign" | "content"

// New types for Analytics charts

export interface ReferrerData {
  domain: string
  clicks: number
  percentage: number
}

export interface HeatmapCell {
  day: number // 0-6 (Sunday to Saturday)
  hour: number // 0-23
  value: number
}

export interface LinkComparisonData {
  date: string
  [key: string]: number | string
}

export interface LinkInfo {
  slug: string
  color: string
}

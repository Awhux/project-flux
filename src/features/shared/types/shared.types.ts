import type { LucideIcon } from "lucide-react"

/**
 * Trend indicator for metric cards
 */
export interface TrendIndicator {
  value: number
  isPositive: boolean
}

/**
 * Props for metric card component
 */
export interface MetricCardProps {
  /** Label displayed above the value */
  label: string
  /** Main value to display */
  value: string | number
  /** Lucide icon component */
  icon: LucideIcon
  /** Optional trend indicator */
  trend?: TrendIndicator
  /** Card variant for color theming */
  variant?: "default" | "blue" | "green" | "purple" | "orange"
  /** Card size variant */
  size?: "default" | "compact" | "large"
  /** Additional CSS classes */
  className?: string
}

/**
 * Chart data point for clicks over time
 */
export interface ClicksDataPoint {
  date: string
  clicks: number
}

/**
 * Chart data point for UTM breakdown
 */
export interface UtmDataPoint {
  source: string
  clicks: number
}

/**
 * Device chart data point
 */
export interface DeviceDataPoint {
  device: string
  value: number
}

/**
 * Usage indicator props
 */
export interface UsageIndicatorProps {
  current: number
  limit: number
  planTier: "FREE" | "PRO" | "AGENCY"
}

/**
 * Plan tier type
 */
export type PlanTier = "FREE" | "PRO" | "AGENCY"

/**
 * Date range filter options
 */
export type DateRangeOption = "7" | "30" | "90" | "custom"

/**
 * Filter status options
 */
export type StatusFilter = "all" | "active" | "inactive"

/**
 * Sort options for tables
 */
export type SortOption =
  | "newest"
  | "oldest"
  | "most-clicks"
  | "least-clicks"
  | "a-z"
  | "z-a"

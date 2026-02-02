"use client"

import { useQuery } from "@tanstack/react-query"
import type {
  AnalyticsMetrics,
  AnalyticsTrends,
  ClicksChartData,
  UtmChartData,
  DeviceChartData,
  ReferrerData,
  HeatmapCell,
  LinkComparisonData,
  LinkInfo,
  DateRange,
} from "../types"

export interface AnalyticsData {
  metrics: AnalyticsMetrics
  trends: AnalyticsTrends
  clicksData: ClicksChartData[]
  utmSource: UtmChartData[]
  utmMedium: UtmChartData[]
  utmCampaign: UtmChartData[]
  utmContent: UtmChartData[]
  deviceData: DeviceChartData[]
  referrerData: ReferrerData[]
  heatmapData: HeatmapCell[]
  linkComparisonData: LinkComparisonData[]
  comparisonLinks: LinkInfo[]
}

export interface UseAnalyticsQueryOptions {
  /** Link selecionado para filtrar ("all" para todos os links) */
  selectedLink: string
  /** Período selecionado */
  dateRange: DateRange
}

/**
 * Fetch analytics data from the API
 */
async function fetchAnalytics(
  selectedLink: string,
  dateRange: DateRange
): Promise<AnalyticsData> {
  const params = new URLSearchParams({
    dateRange,
  })

  if (selectedLink !== "all") {
    params.set("linkId", selectedLink)
  }

  const response = await fetch(`/api/analytics?${params.toString()}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData?.error?.message || "Erro ao carregar analytics")
  }

  return response.json()
}

/**
 * Hook para buscar dados de analytics usando TanStack Query
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useAnalyticsQuery({
 *   selectedLink: "all",
 *   dateRange: "30",
 * })
 * ```
 */
export function useAnalyticsQuery({
  selectedLink,
  dateRange,
}: UseAnalyticsQueryOptions) {
  return useQuery({
    queryKey: ["analytics", selectedLink, dateRange] as const,
    queryFn: () => fetchAnalytics(selectedLink, dateRange),
    // These are the default behaviors as configured in QueryProvider
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  })
}

// Query keys for analytics (useful for invalidation)
export const analyticsQueryKeys = {
  all: ["analytics"] as const,
  byFilters: (selectedLink: string, dateRange: DateRange) =>
    ["analytics", selectedLink, dateRange] as const,
}

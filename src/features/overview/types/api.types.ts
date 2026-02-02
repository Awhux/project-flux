import type {
  OverviewMetrics,
  OverviewTrends,
  TopLinkData,
  FunnelData,
  GeoDataPoint,
  ActivityData,
  UsageData,
} from "./overview.types"

export interface OverviewApiResponse {
  metrics: OverviewMetrics
  trends: OverviewTrends
  topLinks: TopLinkData[]
  funnel: FunnelData
  geoData: GeoDataPoint[]
  recentActivity: ActivityData[]
  usage: UsageData
  requestId: string
}

export interface DateRangeParam {
  days: number // 7, 30, 90
}

export interface OverviewQueryParams {
  dateRange: "7" | "30" | "90"
}

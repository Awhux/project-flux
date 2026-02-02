// Components
export {
  AnalyticsHeader,
  AnalyticsFilters,
  MetricsRow,
  DeviceChart,
  UtmTabs,
  ReferrerChart,
  TimeHeatmap,
  LinkComparisonChart,
} from "./components"

export type {
  AnalyticsHeaderProps,
  AnalyticsFiltersProps,
  MetricsRowProps,
  DeviceChartProps,
  UtmTabsProps,
  ReferrerChartProps,
  TimeHeatmapProps,
  LinkComparisonChartProps,
} from "./components"

// Hooks
export {
  useAnalyticsQuery,
  analyticsQueryKeys,
  useUserLinksQuery,
  userLinksQueryKeys,
  useDateRange,
} from "./hooks"

export type { AnalyticsData, UseAnalyticsQueryOptions, LinkOption } from "./hooks"

// Utils
export {
  aggregateClicksByPeriod,
  calculateTotalClicks,
  calculateTotalUtmClicks,
  calculateAggregatedMetrics,
  sortUtmByClicks,
  getTopUtmSources,
  formatClicksChartData,
  formatUtmChartData,
  formatDeviceChartData,
  clicksDataToCsv,
  utmDataToCsv,
  deviceDataToCsv,
  referrerDataToCsv,
  heatmapDataToCsv,
  exportAnalyticsToCsv,
} from "./utils"

// Types
export type {
  AnalyticsMetrics,
  AnalyticsTrends,
  ClicksChartData,
  UtmChartData,
  DeviceChartData,
  DateRange,
  UtmTab,
  ReferrerData,
  HeatmapCell,
  LinkComparisonData,
  LinkInfo,
} from "./types"

// Config (only UI configuration options, no mock data)
export {
  dateRangeOptions,
  utmTabOptions,
} from "./config/analytics.config"

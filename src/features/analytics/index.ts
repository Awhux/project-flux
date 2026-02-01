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
export { useAnalyticsData, useDateRange } from "./hooks"

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

// Config
export {
  mockMetrics,
  mockTrends,
  mockClicksData,
  mockUtmSource,
  mockUtmMedium,
  mockUtmCampaign,
  mockDeviceData,
  mockReferrerData,
  mockHeatmapData,
  mockLinkComparisonData,
  mockComparisonLinks,
  dateRangeOptions,
  linkFilterOptions,
  utmTabOptions,
} from "./config/analytics.config"

import {
  analyticsRepository,
  type DateRangeParams,
} from "../infrastructure/analytics.repository"
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

// Chart colors for link comparison
const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

// Device type display labels
const DEVICE_LABELS: Record<string, string> = {
  MOBILE: "Mobile",
  DESKTOP: "Desktop",
  TABLET: "Tablet",
  OTHER: "Outro",
}

/**
 * Calculate date range from a string like "7", "30", "90"
 */
function calculateDateRange(rangeStr: DateRange): DateRangeParams {
  const days = parseInt(rangeStr, 10)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Set times to cover full days
  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(23, 59, 59, 999)

  return { startDate, endDate }
}

/**
 * Calculate previous date range for trend comparison
 */
function calculatePreviousDateRange(rangeStr: DateRange): DateRangeParams {
  const days = parseInt(rangeStr, 10)
  const endDate = new Date()
  endDate.setDate(endDate.getDate() - days)
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - days)

  // Set times to cover full days
  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(23, 59, 59, 999)

  return { startDate, endDate }
}

/**
 * Calculate trend percentage
 */
function calculateTrendPercentage(
  current: number,
  previous: number
): { value: number; isPositive: boolean } {
  if (previous === 0) {
    return { value: current > 0 ? 100 : 0, isPositive: current > 0 }
  }

  const change = ((current - previous) / previous) * 100
  return {
    value: Math.abs(Math.round(change * 10) / 10),
    isPositive: change >= 0,
  }
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string | null): string {
  if (!url) return "Direto"

  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace(/^www\./, "")
  } catch {
    // If not a valid URL, check if it's just a domain
    if (url.includes(".")) {
      return url.replace(/^www\./, "")
    }
    return "Direto"
  }
}

/**
 * Format date for chart display (e.g., "1 Jan")
 */
function formatDateForChart(date: Date): string {
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ]
  return `${date.getDate()} ${months[date.getMonth()]}`
}

/**
 * Fill missing dates in time series with zero values
 */
function fillMissingDates(
  data: { date: Date; clicks: number }[],
  dateRange: DateRangeParams
): ClicksChartData[] {
  const dataMap = new Map(
    data.map((d) => [d.date.toISOString().split("T")[0], d.clicks])
  )

  const result: ClicksChartData[] = []
  const currentDate = new Date(dateRange.startDate)

  while (currentDate <= dateRange.endDate) {
    const dateKey = currentDate.toISOString().split("T")[0]
    result.push({
      date: formatDateForChart(new Date(currentDate)),
      clicks: dataMap.get(dateKey) || 0,
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return result
}

/**
 * Fill missing heatmap cells with zero values
 */
function fillHeatmapData(
  data: { dayOfWeek: number; hour: number; clicks: number }[]
): HeatmapCell[] {
  const dataMap = new Map(data.map((d) => [`${d.dayOfWeek}-${d.hour}`, d.clicks]))

  const result: HeatmapCell[] = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      result.push({
        day,
        hour,
        value: dataMap.get(`${day}-${hour}`) || 0,
      })
    }
  }

  return result
}

export interface AnalyticsServiceResponse {
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

export interface AnalyticsServiceParams {
  userId: string
  linkId?: string
  dateRange: DateRange
}

/**
 * Analytics Service
 * Orchestrates repository calls and transforms data for the API
 */
export const analyticsService = {
  /**
   * Get complete analytics data for a user
   */
  async getAnalytics(
    params: AnalyticsServiceParams
  ): Promise<AnalyticsServiceResponse> {
    const { userId, linkId, dateRange: dateRangeStr } = params

    const dateRange = calculateDateRange(dateRangeStr)
    const previousDateRange = calculatePreviousDateRange(dateRangeStr)

    const queryParams = {
      userId,
      linkId,
      dateRange,
    }

    // Execute all queries in parallel for better performance
    const [
      metrics,
      trendMetrics,
      clicksTimeSeries,
      utmSourceData,
      utmMediumData,
      utmCampaignData,
      utmContentData,
      deviceData,
      referrerData,
      heatmapData,
      topLinks,
    ] = await Promise.all([
      analyticsRepository.getMetrics(queryParams),
      analyticsRepository.getTrendMetrics(queryParams, previousDateRange),
      analyticsRepository.getClicksTimeSeries(queryParams),
      analyticsRepository.getUtmBreakdown(queryParams, "source"),
      analyticsRepository.getUtmBreakdown(queryParams, "medium"),
      analyticsRepository.getUtmBreakdown(queryParams, "campaign"),
      analyticsRepository.getUtmBreakdown(queryParams, "content"),
      analyticsRepository.getDeviceBreakdown(queryParams),
      analyticsRepository.getReferrerBreakdown(queryParams, 10),
      analyticsRepository.getTimeHeatmap(queryParams),
      analyticsRepository.getTopLinksForComparison(userId, dateRange, 5),
    ])

    // Get link comparison data for top links
    const topLinkIds = topLinks.map((l) => l.linkId)
    const linkComparisonRaw =
      topLinkIds.length > 0
        ? await analyticsRepository.getLinkComparison(userId, topLinkIds, dateRange)
        : []

    // Transform metrics
    const conversionRate =
      metrics.totalClicks > 0
        ? Math.round((metrics.totalLeads / metrics.totalClicks) * 1000) / 10
        : 0

    const transformedMetrics: AnalyticsMetrics = {
      totalClicks: metrics.totalClicks,
      totalLeads: metrics.totalLeads,
      conversionRate,
    }

    // Calculate trends
    const currentConversionRate =
      trendMetrics.currentClicks > 0
        ? (trendMetrics.currentLeads / trendMetrics.currentClicks) * 100
        : 0
    const previousConversionRate =
      trendMetrics.previousClicks > 0
        ? (trendMetrics.previousLeads / trendMetrics.previousClicks) * 100
        : 0

    const trends: AnalyticsTrends = {
      clicks: calculateTrendPercentage(
        trendMetrics.currentClicks,
        trendMetrics.previousClicks
      ),
      leads: calculateTrendPercentage(
        trendMetrics.currentLeads,
        trendMetrics.previousLeads
      ),
      conversion: calculateTrendPercentage(
        currentConversionRate,
        previousConversionRate
      ),
    }

    // Transform clicks time series (fill missing dates)
    const transformedClicksData = fillMissingDates(clicksTimeSeries, dateRange)

    // Transform UTM data
    const transformUtmData = (
      data: { value: string | null; clicks: number }[]
    ): UtmChartData[] =>
      data
        .filter((d) => d.value !== null)
        .map((d) => ({
          source: d.value as string,
          clicks: d.clicks,
        }))

    // Transform device data
    const transformedDeviceData: DeviceChartData[] = deviceData.map((d) => ({
      device: DEVICE_LABELS[d.device] || d.device,
      value: d.count,
    }))

    // Transform referrer data
    const totalReferrerClicks = referrerData.reduce(
      (sum, d) => sum + d.clicks,
      0
    )
    const transformedReferrerData: ReferrerData[] = referrerData.map((d) => ({
      domain: extractDomain(d.referrer),
      clicks: d.clicks,
      percentage:
        totalReferrerClicks > 0
          ? Math.round((d.clicks / totalReferrerClicks) * 1000) / 10
          : 0,
    }))

    // Transform heatmap data (fill all 24*7 cells)
    const transformedHeatmapData = fillHeatmapData(heatmapData)

    // Transform link comparison data
    const linkComparisonByDate = new Map<string, LinkComparisonData>()
    linkComparisonRaw.forEach((d) => {
      const dateStr = formatDateForChart(d.date)
      const existing = linkComparisonByDate.get(dateStr) || { date: dateStr }
      existing[d.slug] = d.clicks
      linkComparisonByDate.set(dateStr, existing)
    })

    // Fill missing dates for link comparison
    const comparisonDates: LinkComparisonData[] = []
    const currentDate = new Date(dateRange.startDate)
    const slugs = topLinks.map((l) => l.slug)

    while (currentDate <= dateRange.endDate) {
      const dateStr = formatDateForChart(new Date(currentDate))
      const existing = linkComparisonByDate.get(dateStr) || { date: dateStr }

      // Fill missing slugs with 0
      slugs.forEach((slug) => {
        if (existing[slug] === undefined) {
          existing[slug] = 0
        }
      })

      comparisonDates.push(existing)
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Create link info with colors
    const comparisonLinks: LinkInfo[] = topLinks.map((link, index) => ({
      slug: link.slug,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }))

    return {
      metrics: transformedMetrics,
      trends,
      clicksData: transformedClicksData,
      utmSource: transformUtmData(utmSourceData),
      utmMedium: transformUtmData(utmMediumData),
      utmCampaign: transformUtmData(utmCampaignData),
      utmContent: transformUtmData(utmContentData),
      deviceData: transformedDeviceData,
      referrerData: transformedReferrerData,
      heatmapData: transformedHeatmapData,
      linkComparisonData: comparisonDates,
      comparisonLinks,
    }
  },

  /**
   * Get user's links for filter dropdown
   */
  async getUserLinks(userId: string) {
    return analyticsRepository.getUserLinks(userId)
  },
}

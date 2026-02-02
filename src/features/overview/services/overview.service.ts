import { overviewRepository, type RepoDateRange, type SparklinePoint } from "../infrastructure/overview.repository"
import type {
  OverviewApiResponse,
  OverviewMetrics,
  OverviewTrends,
  TopLinkData,
  FunnelData,
  GeoDataPoint,
  ActivityData,
  UsageData,
  ActivityType
} from "../types"

// Helper to calculate date ranges
function calculateDateRange(daysStr: "7" | "30" | "90"): RepoDateRange {
  const days = parseInt(daysStr, 10)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Set times to cover full days
  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(23, 59, 59, 999)

  return { startDate, endDate }
}

function calculatePreviousDateRange(daysStr: "7" | "30" | "90"): RepoDateRange {
  const days = parseInt(daysStr, 10)
  const endDate = new Date()
  endDate.setDate(endDate.getDate() - days)
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - days)

  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(23, 59, 59, 999)

  return { startDate, endDate }
}

function calculateTrend(current: number, previous: number): { value: number; isPositive: boolean } {
  if (previous === 0) {
    return { value: current > 0 ? 100 : 0, isPositive: current > 0 }
  }

  const change = ((current - previous) / previous) * 100
  return {
    value: Math.abs(Math.round(change * 10) / 10),
    isPositive: change >= 0
  }
}

function fillSparklineData(data: SparklinePoint[], dateRange: RepoDateRange, linkId: string): number[] {
  const { startDate, endDate } = dateRange
  const dataMap = new Map(data.filter(d => d.linkId === linkId).map(d => [d.date.toISOString().split('T')[0], d.clicks]))

  const result: number[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0]
    result.push(dataMap.get(dateKey) || 0)
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return result
}

export const overviewService = {
  async getOverviewData(userId: string, dateRangeStr: "7" | "30" | "90", requestId: string): Promise<OverviewApiResponse> {
    const currentRange = calculateDateRange(dateRangeStr)
    const previousRange = calculatePreviousDateRange(dateRangeStr)

    // Parallelize main data gathering
    const [
      currentMetrics,
      prevMetrics,
      topLinksRaw,
      funnelRaw,
      geoRaw,
      activityRaw,
      usageRaw
    ] = await Promise.all([
      overviewRepository.getOverviewMetrics(userId, currentRange),
      overviewRepository.getPreviousPeriodMetrics(userId, previousRange),
      overviewRepository.getTopLinksWithSparklines(userId, currentRange, 5),
      overviewRepository.getFunnelData(userId, currentRange),
      overviewRepository.getGeoDistribution(userId, currentRange, 5),
      overviewRepository.getRecentActivity(userId, 10),
      overviewRepository.getUserUsageData(userId)
    ])

    // 1. Calculate Metrics & Trends
    const conversionRate = currentMetrics.totalClicks > 0
      ? (currentMetrics.totalLeads / currentMetrics.totalClicks) * 100
      : 0

    const prevConversionRate = prevMetrics.clicks > 0
      ? (prevMetrics.leads / prevMetrics.clicks) * 100
      : 0

    const metrics: OverviewMetrics = {
      totalClicks: currentMetrics.totalClicks,
      totalLeads: currentMetrics.totalLeads,
      conversionRate: Math.round(conversionRate * 10) / 10,
      activeLinks: currentMetrics.activeLinks,
    }

    const trends: OverviewTrends = {
      clicks: calculateTrend(currentMetrics.totalClicks, prevMetrics.clicks),
      leads: calculateTrend(currentMetrics.totalLeads, prevMetrics.leads),
      conversion: calculateTrend(conversionRate, prevConversionRate),
      // Active links trend is hard to calculate historically without snapshots. 
      // We'll return 0 change for now or compare current to current (0%)
      activeLinks: { value: 0, isPositive: true }
    }

    // 2. Process Top Links
    // Group raw sparkline data by link
    const uniqueLinks = Array.from(new Set(topLinksRaw.map(l => l.linkId))).map(id => {
      const info = topLinksRaw.find(l => l.linkId === id)!
      return { id, slug: info.slug }
    })

    // Calculate total clicks for each link from sparkline points
    const topLinks: TopLinkData[] = uniqueLinks.map(link => {
      const sparkline = fillSparklineData(topLinksRaw, currentRange, link.id)
      const totalClicks = sparkline.reduce((sum, val) => sum + val, 0)

      // Calculate trend for link (compare first half vs second half of period as approximation, 
      // or just random/0 if we don't query previous period per link. 
      // For accuracy we'd need previous period data per link.
      // Let's assume 0 trend for links for now to save queries, or implement proper link trend later.)
      const trend = { value: 0, isPositive: true }

      return {
        id: link.id,
        slug: link.slug,
        clicks: totalClicks,
        trend,
        sparkline
      }
    }).sort((a, b) => b.clicks - a.clicks)

    // 3. Process Funnel
    // Assuming conversions = leads for now, or some % of leads.
    // In many systems, "WhatsApp Open" is the conversion event.
    // If we don't track it separately, let's assume Conversion = Lead (100% of leads converted to contacts)
    // Or we can mock it as slightly less than leads if needed, but let's be honest with data.
    const funnel: FunnelData = {
      totalClicks: funnelRaw.clicks,
      totalLeads: funnelRaw.leads,
      totalConversions: funnelRaw.leads // Placeholder until we track 'conversions' specifically
    }

    // 4. Process Geo Data
    const totalGeoClicks = geoRaw.reduce((sum, item) => sum + item.clicks, 0)
    const geoData: GeoDataPoint[] = geoRaw.map(item => ({
      region: item.region, // This is city name
      flag: "🇧🇷", // Hardcoded flag for now, or lookup based on country code
      clicks: item.clicks,
      percentage: totalGeoClicks > 0 ? Math.round((item.clicks / totalGeoClicks) * 1000) / 10 : 0
    }))

    // 5. Process Activity Feed
    const activities: ActivityData[] = []

    activityRaw.clicks.forEach(c => {
      activities.push({
        id: c.id,
        type: "click",
        linkSlug: c.link.slug,
        timestamp: c.timestamp,
        metadata: {
          region: c.city || undefined,
          utmSource: c.utmSource || undefined
        }
      })
    })

    activityRaw.leads.forEach(l => {
      activities.push({
        id: l.id,
        type: "lead",
        linkSlug: l.link.slug,
        timestamp: l.convertedAt,
        metadata: {
          visitorName: l.name || undefined,
          utmSource: l.utmSource || undefined
        }
      })
    })

    activityRaw.links.forEach(l => {
      activities.push({
        id: l.id,
        type: "link_created",
        linkSlug: l.slug,
        timestamp: l.createdAt
      })
    })

    const recentActivity = activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)

    // 6. Process Usage
    const usage: UsageData = {
      current: usageRaw.usage?.clicksUsed || 0,
      limit: usageRaw.usage?.clicksLimit || 1000,
      planTier: usageRaw.subscription?.plan || "FREE"
    }

    return {
      metrics,
      trends,
      topLinks,
      funnel,
      geoData,
      recentActivity,
      usage,
      requestId
    }
  }
}

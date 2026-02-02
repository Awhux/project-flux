import { prisma } from "@/features/database/server"
import { Prisma } from "@prisma/client"

export interface DateRangeParams {
  startDate: Date
  endDate: Date
}

export interface AnalyticsQueryParams {
  userId: string
  linkId?: string
  dateRange: DateRangeParams
}

export interface MetricsResult {
  totalClicks: number
  totalLeads: number
}

export interface TrendMetricsResult {
  currentClicks: number
  previousClicks: number
  currentLeads: number
  previousLeads: number
}

export interface ClicksTimeSeriesResult {
  date: Date
  clicks: number
}

export interface UtmBreakdownResult {
  value: string | null
  clicks: number
}

export interface DeviceBreakdownResult {
  device: string
  count: number
}

export interface ReferrerBreakdownResult {
  referrer: string | null
  clicks: number
}

export interface HeatmapResult {
  dayOfWeek: number
  hour: number
  clicks: number
}

export interface LinkComparisonResult {
  linkId: string
  slug: string
  date: Date
  clicks: number
}

/**
 * Analytics Repository
 * Handles all database queries for analytics data
 * Uses Prisma with raw SQL for complex aggregations
 */
export const analyticsRepository = {
  /**
   * Get total clicks and leads for a user/link in a date range
   */
  async getMetrics(params: AnalyticsQueryParams): Promise<MetricsResult> {
    const { userId, linkId, dateRange } = params

    const clicksWhere: Prisma.ClickWhereInput = {
      userId,
      timestamp: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      ...(linkId && { linkId }),
    }

    const leadsWhere: Prisma.LeadWhereInput = {
      userId,
      convertedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      ...(linkId && { linkId }),
    }

    const [totalClicks, totalLeads] = await Promise.all([
      prisma.click.count({ where: clicksWhere }),
      prisma.lead.count({ where: leadsWhere }),
    ])

    return { totalClicks, totalLeads }
  },

  /**
   * Get trend metrics comparing current period to previous period
   */
  async getTrendMetrics(
    params: AnalyticsQueryParams,
    previousDateRange: DateRangeParams
  ): Promise<TrendMetricsResult> {
    const { userId, linkId, dateRange } = params

    const currentClicksWhere: Prisma.ClickWhereInput = {
      userId,
      timestamp: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      ...(linkId && { linkId }),
    }

    const previousClicksWhere: Prisma.ClickWhereInput = {
      userId,
      timestamp: {
        gte: previousDateRange.startDate,
        lte: previousDateRange.endDate,
      },
      ...(linkId && { linkId }),
    }

    const currentLeadsWhere: Prisma.LeadWhereInput = {
      userId,
      convertedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      ...(linkId && { linkId }),
    }

    const previousLeadsWhere: Prisma.LeadWhereInput = {
      userId,
      convertedAt: {
        gte: previousDateRange.startDate,
        lte: previousDateRange.endDate,
      },
      ...(linkId && { linkId }),
    }

    const [currentClicks, previousClicks, currentLeads, previousLeads] =
      await Promise.all([
        prisma.click.count({ where: currentClicksWhere }),
        prisma.click.count({ where: previousClicksWhere }),
        prisma.lead.count({ where: currentLeadsWhere }),
        prisma.lead.count({ where: previousLeadsWhere }),
      ])

    return {
      currentClicks,
      previousClicks,
      currentLeads,
      previousLeads,
    }
  },

  /**
   * Get clicks time series data grouped by day
   */
  async getClicksTimeSeries(
    params: AnalyticsQueryParams
  ): Promise<ClicksTimeSeriesResult[]> {
    const { userId, linkId, dateRange } = params

    const results = await prisma.$queryRaw<
      { date: Date; clicks: bigint }[]
    >(
      Prisma.sql`
        SELECT 
          DATE_TRUNC('day', "timestamp") as date,
          COUNT(*) as clicks
        FROM clicks
        WHERE 
          user_id = ${userId}
          AND "timestamp" >= ${dateRange.startDate}
          AND "timestamp" <= ${dateRange.endDate}
          ${linkId ? Prisma.sql`AND link_id = ${linkId}` : Prisma.empty}
        GROUP BY DATE_TRUNC('day', "timestamp")
        ORDER BY date ASC
      `
    )

    return results.map((row) => ({
      date: row.date,
      clicks: Number(row.clicks),
    }))
  },

  /**
   * Get UTM breakdown by dimension (source, medium, campaign, content)
   */
  async getUtmBreakdown(
    params: AnalyticsQueryParams,
    dimension: "source" | "medium" | "campaign" | "content"
  ): Promise<UtmBreakdownResult[]> {
    const { userId, linkId, dateRange } = params

    const columnMap = {
      source: "utm_source",
      medium: "utm_medium",
      campaign: "utm_campaign",
      content: "utm_content",
    }

    const column = columnMap[dimension]

    const results = await prisma.$queryRawUnsafe<
      { value: string | null; clicks: bigint }[]
    >(
      `
      SELECT 
        ${column} as value,
        COUNT(*) as clicks
      FROM clicks
      WHERE 
        user_id = $1
        AND "timestamp" >= $2
        AND "timestamp" <= $3
        ${linkId ? `AND link_id = $4` : ""}
      GROUP BY ${column}
      ORDER BY clicks DESC
      LIMIT 10
    `,
      userId,
      dateRange.startDate,
      dateRange.endDate,
      ...(linkId ? [linkId] : [])
    )

    return results.map((row) => ({
      value: row.value,
      clicks: Number(row.clicks),
    }))
  },

  /**
   * Get device breakdown
   */
  async getDeviceBreakdown(
    params: AnalyticsQueryParams
  ): Promise<DeviceBreakdownResult[]> {
    const { userId, linkId, dateRange } = params

    const where: Prisma.ClickWhereInput = {
      userId,
      timestamp: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      ...(linkId && { linkId }),
    }

    const results = await prisma.click.groupBy({
      by: ["device"],
      where,
      _count: {
        device: true,
      },
      orderBy: {
        _count: {
          device: "desc",
        },
      },
    })

    return results.map((row) => ({
      device: row.device,
      count: row._count.device,
    }))
  },

  /**
   * Get referrer breakdown with domain extraction
   */
  async getReferrerBreakdown(
    params: AnalyticsQueryParams,
    limit: number = 10
  ): Promise<ReferrerBreakdownResult[]> {
    const { userId, linkId, dateRange } = params

    const results = await prisma.$queryRaw<
      { referrer: string | null; clicks: bigint }[]
    >(
      Prisma.sql`
        SELECT 
          referrer,
          COUNT(*) as clicks
        FROM clicks
        WHERE 
          user_id = ${userId}
          AND "timestamp" >= ${dateRange.startDate}
          AND "timestamp" <= ${dateRange.endDate}
          ${linkId ? Prisma.sql`AND link_id = ${linkId}` : Prisma.empty}
        GROUP BY referrer
        ORDER BY clicks DESC
        LIMIT ${limit}
      `
    )

    return results.map((row) => ({
      referrer: row.referrer,
      clicks: Number(row.clicks),
    }))
  },

  /**
   * Get heatmap data grouped by day of week and hour
   */
  async getTimeHeatmap(params: AnalyticsQueryParams): Promise<HeatmapResult[]> {
    const { userId, linkId, dateRange } = params

    const results = await prisma.$queryRaw<
      { day_of_week: number; hour: number; clicks: bigint }[]
    >(
      Prisma.sql`
        SELECT 
          EXTRACT(DOW FROM "timestamp")::int as day_of_week,
          EXTRACT(HOUR FROM "timestamp")::int as hour,
          COUNT(*) as clicks
        FROM clicks
        WHERE 
          user_id = ${userId}
          AND "timestamp" >= ${dateRange.startDate}
          AND "timestamp" <= ${dateRange.endDate}
          ${linkId ? Prisma.sql`AND link_id = ${linkId}` : Prisma.empty}
        GROUP BY day_of_week, hour
        ORDER BY day_of_week, hour
      `
    )

    return results.map((row) => ({
      dayOfWeek: row.day_of_week,
      hour: row.hour,
      clicks: Number(row.clicks),
    }))
  },

  /**
   * Get link comparison data for multiple links
   */
  async getLinkComparison(
    userId: string,
    linkIds: string[],
    dateRange: DateRangeParams
  ): Promise<LinkComparisonResult[]> {
    if (linkIds.length === 0) {
      return []
    }

    const results = await prisma.$queryRaw<
      { link_id: string; slug: string; date: Date; clicks: bigint }[]
    >(
      Prisma.sql`
        SELECT 
          c.link_id,
          l.slug,
          DATE_TRUNC('day', c."timestamp") as date,
          COUNT(*) as clicks
        FROM clicks c
        INNER JOIN links l ON c.link_id = l.id
        WHERE 
          c.user_id = ${userId}
          AND c."timestamp" >= ${dateRange.startDate}
          AND c."timestamp" <= ${dateRange.endDate}
          AND c.link_id = ANY(${linkIds}::varchar[])
        GROUP BY c.link_id, l.slug, DATE_TRUNC('day', c."timestamp")
        ORDER BY date ASC, l.slug ASC
      `
    )

    return results.map((row) => ({
      linkId: row.link_id,
      slug: row.slug,
      date: row.date,
      clicks: Number(row.clicks),
    }))
  },

  /**
   * Get user's top links for comparison
   */
  async getTopLinksForComparison(
    userId: string,
    dateRange: DateRangeParams,
    limit: number = 5
  ): Promise<{ linkId: string; slug: string; totalClicks: number }[]> {
    const results = await prisma.$queryRaw<
      { link_id: string; slug: string; total_clicks: bigint }[]
    >(
      Prisma.sql`
        SELECT 
          c.link_id,
          l.slug,
          COUNT(*) as total_clicks
        FROM clicks c
        INNER JOIN links l ON c.link_id = l.id
        WHERE 
          c.user_id = ${userId}
          AND c."timestamp" >= ${dateRange.startDate}
          AND c."timestamp" <= ${dateRange.endDate}
        GROUP BY c.link_id, l.slug
        ORDER BY total_clicks DESC
        LIMIT ${limit}
      `
    )

    return results.map((row) => ({
      linkId: row.link_id,
      slug: row.slug,
      totalClicks: Number(row.total_clicks),
    }))
  },

  /**
   * Get all links for a user (for filter dropdown)
   */
  async getUserLinks(
    userId: string
  ): Promise<{ id: string; slug: string; clickCount: number }[]> {
    const links = await prisma.link.findMany({
      where: { userId },
      select: {
        id: true,
        slug: true,
        clickCount: true,
      },
      orderBy: { clickCount: "desc" },
    })

    return links
  },
}

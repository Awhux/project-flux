import { prisma } from "@/features/database/server"
import { Prisma } from "@prisma/client"

export interface RepoDateRange {
  startDate: Date
  endDate: Date
}

export interface SparklinePoint {
  linkId: string
  slug: string
  date: Date
  clicks: number
}

/**
 * Overview Repository
 * Handles optimized database access for the dashboard overview
 */
export const overviewRepository = {
  /**
   * Get aggregated metrics for the current period
   */
  async getOverviewMetrics(userId: string, dateRange: RepoDateRange) {
    const { startDate, endDate } = dateRange

    // Execute count queries in parallel
    const [totalClicks, totalLeads, activeLinks] = await Promise.all([
      prisma.click.count({
        where: {
          userId,
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      prisma.lead.count({
        where: {
          userId,
          convertedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      prisma.link.count({
        where: {
          userId,
          isActive: true,
        },
      }),
    ])

    return {
      totalClicks,
      totalLeads,
      activeLinks,
    }
  },

  /**
   * Get total clicks and leads for the previous period (for trend calculation)
   */
  async getPreviousPeriodMetrics(userId: string, dateRange: RepoDateRange) {
    const { startDate, endDate } = dateRange

    const [clicks, leads] = await Promise.all([
      prisma.click.count({
        where: {
          userId,
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      prisma.lead.count({
        where: {
          userId,
          convertedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    ])

    return { clicks, leads }
  },

  /**
   * Get top links with daily click data for sparklines
   */
  async getTopLinksWithSparklines(
    userId: string,
    dateRange: RepoDateRange,
    limit: number = 5
  ): Promise<SparklinePoint[]> {
    const { startDate, endDate } = dateRange

    // First find top links by total clicks in period to identify which ones to fetch details for
    // This optimization avoids aggregating daily data for ALL links
    const topLinks = await prisma.click.groupBy({
      by: ['linkId'],
      where: {
        userId,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          linkId: 'desc',
        }
      },
      take: limit,
    })

    const topLinkIds = topLinks.map(l => l.linkId)

    if (topLinkIds.length === 0) return []

    // Now fetch daily breakdown only for these top links
    const results = await prisma.$queryRaw<
      { link_id: string; slug: string; date: Date; clicks: bigint }[]
    >(Prisma.sql`
      SELECT 
        c.link_id,
        l.slug,
        DATE_TRUNC('day', c."timestamp") as date,
        COUNT(*) as clicks
      FROM clicks c
      INNER JOIN links l ON c.link_id = l.id
      WHERE 
        c.user_id = ${userId}
        AND c."timestamp" >= ${startDate}
        AND c."timestamp" <= ${endDate}
        AND c.link_id = ANY(${topLinkIds}::varchar[])
      GROUP BY c.link_id, l.slug, DATE_TRUNC('day', c."timestamp")
      ORDER BY date ASC
    `)

    return results.map(row => ({
      linkId: row.link_id,
      slug: row.slug,
      date: row.date,
      clicks: Number(row.clicks),
    }))
  },

  /**
   * Get funnel data (Clicks -> Leads)
   * Note: "WhatsApp Abertos" (Conversions) logic depends on implementation. 
   * Assuming 'leads' are captured leads, and we might need another metric for whatsapp opens if tracked.
   * Based on schema, Lead has 'convertedAt'. 
   * Usually Funnel is: Clicks (Total) -> Leads (Captured) -> WhatsApp (Redirects/Opens)
   * But typically WhatsApp redirect happens *after* lead capture in many flows, or is the click itself.
   * If we track WhatsApp button clicks separately, we'd query that.
   * For now, we will use:
   * 1. Total Clicks
   * 2. Total Leads
   * 3. Total Conversions (Leads that have convertedAt? All leads have convertedAt usually)
   * 
   * Let's assume for this funnel:
   * Step 1: Unique Visitors (or Clicks)
   * Step 2: Leads Created
   * Step 3: WhatsApp Redirects (if tracked separately, otherwise same as leads or a subset)
   * 
   * Looking at mock data: clicks > leads > conversions.
   * In schema: Lead table.
   * Maybe "Conversions" implies successful redirects.
   * For now, we'll return clicks and leads. The service can decide what "conversions" means or if it's a subset.
   */
  async getFunnelData(userId: string, dateRange: RepoDateRange) {
    const { startDate, endDate } = dateRange

    const [clicks, leads] = await Promise.all([
      prisma.click.count({
        where: {
          userId,
          timestamp: { gte: startDate, lte: endDate },
        },
      }),
      prisma.lead.count({
        where: {
          userId,
          convertedAt: { gte: startDate, lte: endDate },
        },
      }),
    ])

    return { clicks, leads }
  },

  /**
   * Get geographic distribution of clicks
   */
  async getGeoDistribution(userId: string, dateRange: RepoDateRange, limit: number = 5) {
    const { startDate, endDate } = dateRange

    // Group by region (using 'city' or 'country' - mock uses "São Paulo", "Rio", etc which are states/cities)
    // The Click model has 'city' and 'country'.
    // Let's group by 'city' for now as it's more granular, or maybe add 'region' to schema later.
    // Ideally we want State/Region. The schema only has `city` and `country`.
    // We will use `city` as a proxy for "Region" for now, or just return top cities.

    const results = await prisma.click.groupBy({
      by: ['city', 'country'],
      where: {
        userId,
        timestamp: { gte: startDate, lte: endDate },
        city: { not: null },
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          city: 'desc',
        },
      },
      take: limit,
    })

    return results.map(r => ({
      region: r.city || 'Unknown',
      country: r.country || 'Unknown',
      clicks: r._count._all,
    }))
  },

  /**
   * Get recent activity stream
   * Combines Clicks, Leads, and Links
   */
  async getRecentActivity(userId: string, limit: number = 10) {
    // Fetch recent items from each source
    const [clicks, leads, links] = await Promise.all([
      prisma.click.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: limit,
        include: { link: { select: { slug: true } } },
      }),
      prisma.lead.findMany({
        where: { userId },
        orderBy: { convertedAt: 'desc' },
        take: limit,
        include: { link: { select: { slug: true } } },
      }),
      prisma.link.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: { id: true, slug: true, createdAt: true },
      }),
    ])

    return { clicks, leads, links }
  },

  /**
   * Get user usage data
   */
  async getUserUsageData(userId: string) {
    const [usage, subscription] = await Promise.all([
      prisma.usageLimit.findUnique({
        where: { userId },
      }),
      prisma.subscription.findUnique({
        where: { userId },
        select: { plan: true },
      }),
    ])

    return { usage, subscription }
  },
}

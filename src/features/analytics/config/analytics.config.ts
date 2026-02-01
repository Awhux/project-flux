import type {
  ClicksChartData,
  UtmChartData,
  DeviceChartData,
  AnalyticsMetrics,
  AnalyticsTrends,
  ReferrerData,
  HeatmapCell,
  LinkComparisonData,
  LinkInfo,
} from "../types"

/**
 * Mock metrics data
 */
export const mockMetrics: AnalyticsMetrics = {
  totalClicks: 12345,
  totalLeads: 1234,
  conversionRate: 10.2,
  avgClickTime: "2,5m",
}

/**
 * Mock trends data
 */
export const mockTrends: AnalyticsTrends = {
  clicks: { value: 12.5, isPositive: true },
  leads: { value: 8.2, isPositive: true },
  conversion: { value: 2.1, isPositive: false },
}

/**
 * Mock clicks over time data
 */
export const mockClicksData: ClicksChartData[] = [
  { date: "1 Jan", clicks: 120 },
  { date: "5 Jan", clicks: 180 },
  { date: "10 Jan", clicks: 240 },
  { date: "15 Jan", clicks: 320 },
  { date: "20 Jan", clicks: 280 },
  { date: "25 Jan", clicks: 360 },
  { date: "30 Jan", clicks: 420 },
]

/**
 * Mock UTM source data
 */
export const mockUtmSource: UtmChartData[] = [
  { source: "Facebook", clicks: 1250 },
  { source: "Instagram", clicks: 980 },
  { source: "Google", clicks: 750 },
  { source: "Direto", clicks: 420 },
  { source: "Twitter", clicks: 230 },
]

/**
 * Mock UTM medium data
 */
export const mockUtmMedium: UtmChartData[] = [
  { source: "Social", clicks: 2230 },
  { source: "CPC", clicks: 1050 },
  { source: "Orgânico", clicks: 890 },
  { source: "E-mail", clicks: 460 },
]

/**
 * Mock UTM campaign data
 */
export const mockUtmCampaign: UtmChartData[] = [
  { source: "Promo Verão", clicks: 1800 },
  { source: "Black Friday", clicks: 1200 },
  { source: "Produto Novo", clicks: 950 },
  { source: "Newsletter", clicks: 680 },
]

/**
 * Mock device data
 */
export const mockDeviceData: DeviceChartData[] = [
  { device: "Mobile", value: 2540 },
  { device: "Desktop", value: 1320 },
  { device: "Tablet", value: 560 },
  { device: "Outro", value: 210 },
]

/**
 * Mock referrer data
 */
export const mockReferrerData: ReferrerData[] = [
  { domain: "facebook.com", clicks: 3420, percentage: 35.2 },
  { domain: "instagram.com", clicks: 2180, percentage: 22.4 },
  { domain: "google.com", clicks: 1650, percentage: 17.0 },
  { domain: "Direto", clicks: 1290, percentage: 13.3 },
  { domain: "twitter.com", clicks: 680, percentage: 7.0 },
  { domain: "linkedin.com", clicks: 495, percentage: 5.1 },
]

/**
 * Generate mock heatmap data
 */
function generateHeatmapData(): HeatmapCell[] {
  const data: HeatmapCell[] = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // Simulate realistic patterns
      let baseValue = 10
      // Higher during business hours
      if (hour >= 9 && hour <= 18) baseValue = 40
      // Peak lunch and evening
      if (hour >= 12 && hour <= 14) baseValue = 60
      if (hour >= 19 && hour <= 21) baseValue = 70
      // Lower on weekends
      if (day === 0 || day === 6) baseValue = Math.floor(baseValue * 0.6)
      // Add randomness
      const value = Math.floor(baseValue + Math.random() * 30)
      data.push({ day, hour, value })
    }
  }
  return data
}

export const mockHeatmapData: HeatmapCell[] = generateHeatmapData()

/**
 * Mock link comparison data
 */
export const mockLinkComparisonData: LinkComparisonData[] = [
  { date: "1 Jan", "promo-janeiro": 120, "black-friday": 80, "lancamento-v2": 45 },
  { date: "5 Jan", "promo-janeiro": 180, "black-friday": 95, "lancamento-v2": 62 },
  { date: "10 Jan", "promo-janeiro": 240, "black-friday": 110, "lancamento-v2": 78 },
  { date: "15 Jan", "promo-janeiro": 320, "black-friday": 145, "lancamento-v2": 55 },
  { date: "20 Jan", "promo-janeiro": 280, "black-friday": 160, "lancamento-v2": 48 },
  { date: "25 Jan", "promo-janeiro": 360, "black-friday": 185, "lancamento-v2": 52 },
  { date: "30 Jan", "promo-janeiro": 420, "black-friday": 220, "lancamento-v2": 60 },
]

export const mockComparisonLinks: LinkInfo[] = [
  { slug: "promo-janeiro", color: "hsl(var(--primary))" },
  { slug: "black-friday", color: "hsl(var(--chart-2))" },
  { slug: "lancamento-v2", color: "hsl(var(--chart-3))" },
]

/**
 * Date range options in Portuguese
 */
export const dateRangeOptions = [
  { value: "7", label: "7 dias" },
  { value: "30", label: "30 dias" },
  { value: "90", label: "90 dias" },
] as const

/**
 * Link filter options
 */
export const linkFilterOptions = [
  { value: "all", label: "Todos os Links" },
  { value: "1", label: "promo-verao" },
  { value: "2", label: "black-friday" },
  { value: "3", label: "produto-novo" },
] as const

/**
 * UTM tab options in Portuguese
 */
export const utmTabOptions = [
  { value: "source", label: "Origem" },
  { value: "medium", label: "Mídia" },
  { value: "campaign", label: "Campanha" },
  { value: "content", label: "Conteúdo" },
] as const

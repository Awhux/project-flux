import type {
  ClicksChartData,
  UtmChartData,
  DeviceChartData,
  AnalyticsMetrics,
} from "../types"

/**
 * Agrega dados de cliques por período
 * @param data - Dados brutos de cliques
 * @param groupBy - Agrupamento (day, week, month)
 * @returns Dados agregados
 */
export function aggregateClicksByPeriod(
  data: ClicksChartData[],
  groupBy: "day" | "week" | "month" = "day"
): ClicksChartData[] {
  if (groupBy === "day") return data

  // Implementação simplificada - em produção usaria uma biblioteca de datas
  const grouped = new Map<string, number>()

  data.forEach((item) => {
    const key = item.date // Simplificado
    grouped.set(key, (grouped.get(key) || 0) + item.clicks)
  })

  return Array.from(grouped.entries()).map(([date, clicks]) => ({
    date,
    clicks,
  }))
}

/**
 * Calcula o total de cliques de um conjunto de dados
 * @param data - Dados de cliques
 * @returns Total de cliques
 */
export function calculateTotalClicks(data: ClicksChartData[]): number {
  return data.reduce((sum, item) => sum + item.clicks, 0)
}

/**
 * Calcula o total de uma fonte UTM
 * @param data - Dados de UTM
 * @returns Total de cliques
 */
export function calculateTotalUtmClicks(data: UtmChartData[]): number {
  return data.reduce((sum, item) => sum + item.clicks, 0)
}

/**
 * Calcula métricas agregadas a partir dos dados brutos
 * @param clicksData - Dados de cliques
 * @param deviceData - Dados de dispositivos
 * @param totalLeads - Total de leads
 * @returns Métricas calculadas
 */
export function calculateAggregatedMetrics(
  clicksData: ClicksChartData[],
  deviceData: DeviceChartData[],
  totalLeads: number
): AnalyticsMetrics {
  const totalClicks = calculateTotalClicks(clicksData)
  const totalDeviceClicks = deviceData.reduce((sum, d) => sum + d.value, 0)
  const conversionRate = totalClicks > 0 ? (totalLeads / totalClicks) * 100 : 0

  // Calcula tempo médio (simulado)
  const avgClickTime = "2,5m"

  return {
    totalClicks: totalClicks || totalDeviceClicks,
    totalLeads,
    conversionRate: Math.round(conversionRate * 10) / 10,
    avgClickTime,
  }
}

/**
 * Ordena dados de UTM por cliques (decrescente)
 * @param data - Dados de UTM
 * @returns Dados ordenados
 */
export function sortUtmByClicks(data: UtmChartData[]): UtmChartData[] {
  return [...data].sort((a, b) => b.clicks - a.clicks)
}

/**
 * Obtém os top N itens de UTM
 * @param data - Dados de UTM
 * @param limit - Limite de itens
 * @returns Top N itens
 */
export function getTopUtmSources(
  data: UtmChartData[],
  limit: number = 5
): UtmChartData[] {
  return sortUtmByClicks(data).slice(0, limit)
}

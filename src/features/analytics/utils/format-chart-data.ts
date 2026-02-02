import type {
  ClicksChartData,
  UtmChartData,
  DeviceChartData,
  ReferrerData,
  HeatmapCell,
} from "../types"

/**
 * Formata dados de cliques para exibição no gráfico
 * @param data - Dados brutos
 * @returns Dados formatados com labels legíveis
 */
export function formatClicksChartData(
  data: ClicksChartData[]
): ClicksChartData[] {
  return data.map((item) => ({
    ...item,
    // Mantém a data como está - pode ser customizado para formatação específica
    date: item.date,
  }))
}

/**
 * Formata dados de UTM para exibição no gráfico
 * @param data - Dados brutos
 * @param maxLabelLength - Tamanho máximo do label
 * @returns Dados formatados com labels truncados se necessário
 */
export function formatUtmChartData(
  data: UtmChartData[],
  maxLabelLength: number = 15
): UtmChartData[] {
  return data.map((item) => ({
    ...item,
    source:
      item.source.length > maxLabelLength
        ? `${item.source.slice(0, maxLabelLength)}...`
        : item.source,
  }))
}

/**
 * Formata dados de dispositivos para exibição no gráfico
 * @param data - Dados brutos
 * @returns Dados formatados com porcentagens calculadas
 */
export function formatDeviceChartData(
  data: DeviceChartData[]
): (DeviceChartData & { percentage: number })[] {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return data.map((item) => ({
    ...item,
    percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
  }))
}

/**
 * Converte dados de cliques para formato CSV
 * @param data - Dados de cliques
 * @returns String CSV
 */
export function clicksDataToCsv(data: ClicksChartData[]): string {
  const header = "Data,Cliques"
  const rows = data.map((item) => `${item.date},${item.clicks}`)
  return [header, ...rows].join("\n")
}

/**
 * Converte dados de UTM para formato CSV
 * @param data - Dados de UTM
 * @param columnName - Nome da coluna de origem
 * @returns String CSV
 */
export function utmDataToCsv(
  data: UtmChartData[],
  columnName: string = "Origem"
): string {
  const header = `${columnName},Cliques`
  const rows = data.map((item) => `${item.source},${item.clicks}`)
  return [header, ...rows].join("\n")
}

/**
 * Converte dados de dispositivos para formato CSV
 * @param data - Dados de dispositivos
 * @returns String CSV
 */
export function deviceDataToCsv(data: DeviceChartData[]): string {
  const header = "Dispositivo,Cliques"
  const rows = data.map((item) => `${item.device},${item.value}`)
  return [header, ...rows].join("\n")
}

/**
 * Converte dados de referrer para formato CSV
 * @param data - Dados de referrer
 * @returns String CSV
 */
export function referrerDataToCsv(data: ReferrerData[]): string {
  const header = "Domínio,Cliques,Porcentagem"
  const rows = data.map(
    (item) => `${item.domain},${item.clicks},${item.percentage}%`
  )
  return [header, ...rows].join("\n")
}

/**
 * Converte dados de heatmap para formato CSV
 * @param data - Dados do heatmap
 * @returns String CSV
 */
export function heatmapDataToCsv(data: HeatmapCell[]): string {
  const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
  const header = "Dia,Hora,Cliques"
  const rows = data.map(
    (item) => `${dayNames[item.day]},${item.hour}:00,${item.value}`
  )
  return [header, ...rows].join("\n")
}

/**
 * Exporta todos os dados de análise para um arquivo CSV completo
 * @param clicksData - Dados de cliques
 * @param utmSource - Dados de UTM Source
 * @param utmMedium - Dados de UTM Medium
 * @param utmCampaign - Dados de UTM Campaign
 * @param utmContent - Dados de UTM Content
 * @param deviceData - Dados de dispositivos
 * @param referrerData - Dados de referrer (opcional)
 * @param heatmapData - Dados do heatmap (opcional)
 * @returns String CSV completa
 */
export function exportAnalyticsToCsv(
  clicksData: ClicksChartData[],
  utmSource: UtmChartData[],
  utmMedium: UtmChartData[],
  utmCampaign: UtmChartData[],
  utmContent: UtmChartData[],
  deviceData: DeviceChartData[],
  referrerData?: ReferrerData[],
  heatmapData?: HeatmapCell[]
): string {
  const sections = [
    "=== CLIQUES AO LONGO DO TEMPO ===",
    clicksDataToCsv(clicksData),
    "",
    "=== UTM SOURCE ===",
    utmDataToCsv(utmSource, "Origem"),
    "",
    "=== UTM MEDIUM ===",
    utmDataToCsv(utmMedium, "Mídia"),
    "",
    "=== UTM CAMPAIGN ===",
    utmDataToCsv(utmCampaign, "Campanha"),
    "",
    "=== UTM CONTENT ===",
    utmDataToCsv(utmContent, "Conteúdo"),
    "",
    "=== DISPOSITIVOS ===",
    deviceDataToCsv(deviceData),
  ]

  if (referrerData && referrerData.length > 0) {
    sections.push("")
    sections.push("=== DOMÍNIOS DE ORIGEM ===")
    sections.push(referrerDataToCsv(referrerData))
  }

  if (heatmapData && heatmapData.length > 0) {
    sections.push("")
    sections.push("=== HORÁRIOS DE PICO ===")
    sections.push(heatmapDataToCsv(heatmapData))
  }

  return sections.join("\n")
}

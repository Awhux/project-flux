"use client"

import * as React from "react"
import {
  mockMetrics,
  mockTrends,
  mockClicksData,
  mockUtmSource,
  mockUtmMedium,
  mockUtmCampaign,
  mockDeviceData,
} from "../config/analytics.config"
import type {
  AnalyticsMetrics,
  AnalyticsTrends,
  ClicksChartData,
  UtmChartData,
  DeviceChartData,
  DateRange,
} from "../types"

interface AnalyticsData {
  metrics: AnalyticsMetrics
  trends: AnalyticsTrends
  clicksData: ClicksChartData[]
  utmSource: UtmChartData[]
  utmMedium: UtmChartData[]
  utmCampaign: UtmChartData[]
  deviceData: DeviceChartData[]
}

interface UseAnalyticsDataOptions {
  /** Link selecionado para filtrar */
  selectedLink: string
  /** Período selecionado */
  dateRange: DateRange
}

interface UseAnalyticsDataReturn {
  /** Dados das análises */
  data: AnalyticsData
  /** Se está carregando */
  isLoading: boolean
  /** Erro, se houver */
  error: Error | null
  /** Função para recarregar os dados */
  refetch: () => void
}

/**
 * Hook para gerenciar dados de análises
 * Atualmente usa dados mock, mas pode ser facilmente integrado com API real
 */
export function useAnalyticsData({
  selectedLink,
  dateRange,
}: UseAnalyticsDataOptions): UseAnalyticsDataReturn {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [data, setData] = React.useState<AnalyticsData>({
    metrics: mockMetrics,
    trends: mockTrends,
    clicksData: mockClicksData,
    utmSource: mockUtmSource,
    utmMedium: mockUtmMedium,
    utmCampaign: mockUtmCampaign,
    deviceData: mockDeviceData,
  })

  const fetchData = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simula uma chamada de API com delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Em produção, faria uma chamada real à API aqui
      // const response = await fetch(`/api/analytics?link=${selectedLink}&range=${dateRange}`)
      // const data = await response.json()

      // Por enquanto, usa dados mock com pequenas variações baseadas nos filtros
      const multiplier = dateRange === "7" ? 0.3 : dateRange === "30" ? 1 : 2.5

      setData({
        metrics: {
          ...mockMetrics,
          totalClicks: Math.round(mockMetrics.totalClicks * multiplier),
          totalLeads: Math.round(mockMetrics.totalLeads * multiplier),
        },
        trends: mockTrends,
        clicksData: mockClicksData.map((d) => ({
          ...d,
          clicks: Math.round(d.clicks * multiplier),
        })),
        utmSource: selectedLink === "all"
          ? mockUtmSource
          : mockUtmSource.slice(0, 3),
        utmMedium: mockUtmMedium,
        utmCampaign: mockUtmCampaign,
        deviceData: mockDeviceData,
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erro ao carregar dados"))
    } finally {
      setIsLoading(false)
    }
  }, [selectedLink, dateRange])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  }
}

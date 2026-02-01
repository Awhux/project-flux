"use client"

import * as React from "react"
import {
  AnalyticsHeader,
  MetricsRow,
  DeviceChart,
  UtmTabs,
  ReferrerChart,
  TimeHeatmap,
  LinkComparisonChart,
  useAnalyticsData,
  useDateRange,
  exportAnalyticsToCsv,
  mockReferrerData,
  mockHeatmapData,
  mockLinkComparisonData,
  mockComparisonLinks,
} from "@/features/analytics"
import type { DateRange } from "@/features/analytics"
import { ClicksLineChart } from "@/features/shared"

export default function AnalyticsPage() {
  const { dateRange, setDateRange, getDateRangeLabel } = useDateRange("30")
  const [selectedLink, setSelectedLink] = React.useState("all")
  const [isExporting, setIsExporting] = React.useState(false)

  const { data, isLoading } = useAnalyticsData({
    selectedLink,
    dateRange,
  })

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const csv = exportAnalyticsToCsv(
        data.clicksData,
        data.utmSource,
        data.utmMedium,
        data.utmCampaign,
        data.deviceData
      )

      // Cria e baixa o arquivo CSV
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `relatorio-analises-${dateRange}dias.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Cabeçalho com Filtros */}
      <AnalyticsHeader
        dateRange={dateRange}
        onDateRangeChange={(value) => setDateRange(value as DateRange)}
        selectedLink={selectedLink}
        onLinkChange={setSelectedLink}
        onExport={handleExport}
        isExporting={isExporting}
      />

      {/* Cards de Métricas */}
      <MetricsRow metrics={data.metrics} trends={data.trends} />

      {/* Gráfico de Cliques ao Longo do Tempo */}
      <ClicksLineChart
        data={data.clicksData}
        title="Cliques ao Longo do Tempo"
        description={getDateRangeLabel()}
      />

      {/* Grid de Gráficos: UTM Tabs e Dispositivos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tabs de Parâmetros UTM */}
        <UtmTabs
          sourceData={data.utmSource}
          mediumData={data.utmMedium}
          campaignData={data.utmCampaign}
          contentData={[]}
        />

        {/* Distribuição por Dispositivo */}
        <DeviceChart data={data.deviceData} />
      </div>

      {/* Novos Gráficos Analíticos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Referrers / Domínios de Origem */}
        <ReferrerChart data={mockReferrerData} />

        {/* Heatmap de Horários */}
        <TimeHeatmap data={mockHeatmapData} />
      </div>

      {/* Comparação de Links */}
      <LinkComparisonChart
        data={mockLinkComparisonData}
        links={mockComparisonLinks}
      />
    </div>
  )
}

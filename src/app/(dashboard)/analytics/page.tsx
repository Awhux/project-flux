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
  useAnalyticsQuery,
  useDateRange,
  exportAnalyticsToCsv,
} from "@/features/analytics"
import type { DateRange } from "@/features/analytics"
import { ClicksLineChart } from "@/features/shared"
import { Loader2 } from "lucide-react"

export default function AnalyticsPage() {
  const { dateRange, setDateRange, getDateRangeLabel } = useDateRange("30")
  const [selectedLink, setSelectedLink] = React.useState("all")
  const [isExporting, setIsExporting] = React.useState(false)

  const { data, isLoading, error, refetch, isFetching } = useAnalyticsQuery({
    selectedLink,
    dateRange,
  })

  const handleExport = async () => {
    if (!data) return

    setIsExporting(true)
    try {
      const csv = exportAnalyticsToCsv(
        data.clicksData,
        data.utmSource,
        data.utmMedium,
        data.utmCampaign,
        data.utmContent,
        data.deviceData,
        data.referrerData,
        data.heatmapData
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

  const handleRefresh = () => {
    refetch()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Carregando analytics...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-destructive">Erro ao carregar analytics</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Tente novamente mais tarde"}
          </p>
          <button
            onClick={handleRefresh}
            className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    )
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
        onRefresh={handleRefresh}
        isRefreshing={isFetching}
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
          contentData={data.utmContent}
        />

        {/* Distribuição por Dispositivo */}
        <DeviceChart data={data.deviceData} />
      </div>

      {/* Novos Gráficos Analíticos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Referrers / Domínios de Origem */}
        <ReferrerChart data={data.referrerData} />

        {/* Heatmap de Horários */}
        <TimeHeatmap data={data.heatmapData} />
      </div>

      {/* Comparação de Links */}
      <LinkComparisonChart
        data={data.linkComparisonData}
        links={data.comparisonLinks}
      />
    </div>
  )
}

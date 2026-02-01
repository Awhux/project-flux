"use client"

import * as React from "react"
import {
  OverviewHeader,
  MetricsWithUsage,
  ChartsSection,
  useOverviewData,
} from "@/features/overview"

/**
 * Página de visão geral do dashboard
 * Exibe métricas principais com uso integrado, e gráficos de desempenho
 */
export default function DashboardPage() {
  const { data, isLoading } = useOverviewData()

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Cabeçalho com saudação e ação rápida */}
      <OverviewHeader />

      {/* Grid de métricas com indicador de uso integrado */}
      <MetricsWithUsage
        metrics={data.metrics}
        trends={data.trends}
        usage={data.usage}
        isLoading={isLoading}
      />

      {/* Seção de gráficos - novos charts únicos para Overview */}
      <ChartsSection
        topLinks={data.topLinks}
        funnel={data.funnel}
        geoData={data.geoData}
        recentActivity={data.recentActivity}
        isLoading={isLoading}
      />
    </div>
  )
}

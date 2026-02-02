"use client"

import * as React from "react"
import {
  OverviewHeader,
  MetricsWithUsage,
  ChartsSection,
  useOverviewQuery,
} from "@/features/overview"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

/**
 * Página de visão geral do dashboard
 * Exibe métricas principais com uso integrado, e gráficos de desempenho
 */
export default function DashboardPage() {
  const { data, isLoading, error } = useOverviewQuery("30")

  if (error) {
    return (
      <div className="space-y-6">
        <OverviewHeader />
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Falha ao carregar dados do dashboard. Por favor, tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Fallback for types if data is not yet available but not loading (should cover edge cases)
  // or simple check
  if (!data && !isLoading) {
    return null
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Cabeçalho com saudação e ação rápida */}
      <OverviewHeader />

      {/* Grid de métricas com indicador de uso integrado */}
      {/* We pass data if available, otherwise undefined which is handled if isLoading is true */}
      {/* If isLoading is false, we guaranteed data is present due to check above (or error) */}
      <MetricsWithUsage
        metrics={data?.metrics!}
        trends={data?.trends}
        usage={data?.usage!}
        isLoading={isLoading}
      />

      {/* Seção de gráficos - novos charts únicos para Overview */}
      <ChartsSection
        topLinks={data?.topLinks!}
        funnel={data?.funnel!}
        geoData={data?.geoData!}
        recentActivity={data?.recentActivity!}
        isLoading={isLoading}
      />
    </div>
  )
}

"use client"

import * as React from "react"
import { MousePointer2Icon, UsersIcon, PercentIcon } from "lucide-react"
import { MetricCard } from "@/features/shared"
import { formatNumber, formatPercentage } from "@/features/shared/utils"
import type { AnalyticsMetrics, AnalyticsTrends } from "../types"

export interface MetricsRowProps {
  /** Métricas para exibir */
  metrics: AnalyticsMetrics
  /** Tendências das métricas */
  trends?: AnalyticsTrends
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Linha de métricas da página de análises
 * Exibe 3 cards: Total de Cliques, Total de Leads, Taxa de Conversão
 */
export function MetricsRow({ metrics, trends, className }: MetricsRowProps) {
  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        <MetricCard
          label="Total de Cliques"
          value={formatNumber(metrics.totalClicks)}
          icon={MousePointer2Icon}
          trend={trends?.clicks}
        />
        <MetricCard
          label="Total de Leads"
          value={formatNumber(metrics.totalLeads)}
          icon={UsersIcon}
          trend={trends?.leads}
        />
        <MetricCard
          label="Taxa de Conversão"
          value={formatPercentage(metrics.conversionRate)}
          icon={PercentIcon}
          trend={trends?.conversion}
        />
      </div>
    </div>
  )
}

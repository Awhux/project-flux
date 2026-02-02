"use client"

import * as React from "react"
import { MousePointer2Icon, UsersIcon } from "lucide-react"
import { MetricCard, UsageCard } from "@/features/shared"
import { formatNumber, formatPercentage } from "@/features/shared/utils"
import { cn } from "@/lib/utils"
import type { OverviewMetrics, OverviewTrends, UsageData } from "../types"

export interface MetricsWithUsageProps {
  /** Métricas a serem exibidas */
  metrics: OverviewMetrics
  /** Tendências das métricas */
  trends?: OverviewTrends
  /** Dados de uso do plano */
  usage: UsageData
  /** Estado de carregamento */
  isLoading?: boolean
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Componente combinado de métricas com indicador de uso
 * Layout simplificado: 4 colunas de métricas + card de uso embaixo (full width)
 * Mobile: 2 colunas de métricas, 1 coluna em telas pequenas
 * 
 * Segue princípios 70/10/10: 70% neutral, 10% primary, 10% accent
 * Ícones apenas em métricas críticas (Clicks e Leads)
 */
export function MetricsWithUsage({
  metrics,
  trends,
  usage,
  isLoading,
  className,
}: MetricsWithUsageProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Metrics Grid Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[140px] animate-pulse rounded-xl border bg-muted"
            />
          ))}
        </div>
        {/* Usage Card Skeleton */}
        <div className="h-[180px] animate-pulse rounded-xl border bg-muted" />
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Metrics Grid: 4 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Keep icons only for critical metrics: Clicks and Leads */}
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
        {/* Remove icons from non-critical metrics */}
        <MetricCard
          label="Taxa de Conversão"
          value={formatPercentage(metrics.conversionRate)}
          trend={trends?.conversion}
        />
        <MetricCard
          label="Links Ativos"
          value={metrics.activeLinks}
          trend={trends?.activeLinks}
        />
      </div>

      {/* Usage Card: Full width horizontal layout below metrics */}
      <UsageCard
        current={usage.current}
        limit={usage.limit}
        planTier={usage.planTier}
        variant="horizontal"
      />
    </div>
  )
}

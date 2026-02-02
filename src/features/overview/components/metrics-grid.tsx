"use client"

import * as React from "react"
import { MousePointer2Icon, UsersIcon } from "lucide-react"
import { MetricCard } from "@/features/shared"
import { formatNumber, formatPercentage } from "@/features/shared/utils"
import { cn } from "@/lib/utils"
import type { OverviewMetrics, OverviewTrends } from "../types"

export interface MetricsGridProps {
  /** Métricas a serem exibidas */
  metrics: OverviewMetrics
  /** Tendências das métricas */
  trends?: OverviewTrends
  /** Estado de carregamento */
  isLoading?: boolean
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Grid de cards de métricas
 * Exibe as principais métricas do dashboard
 * 
 * Segue princípios 70/10/10: 70% neutral, 10% primary, 10% accent
 * Ícones apenas em métricas críticas (Clicks e Leads)
 */
export function MetricsGrid({
  metrics,
  trends,
  isLoading,
  className,
}: MetricsGridProps) {
  if (isLoading) {
    return (
      <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[140px] animate-pulse rounded-xl border bg-muted"
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
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
  )
}

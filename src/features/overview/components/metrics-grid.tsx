"use client"

import * as React from "react"
import { MousePointer2Icon, UsersIcon, PercentIcon, LinkIcon } from "lucide-react"
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
      <MetricCard
        label="Links Ativos"
        value={metrics.activeLinks}
        icon={LinkIcon}
        trend={trends?.activeLinks}
      />
    </div>
  )
}

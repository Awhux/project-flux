"use client"

import * as React from "react"
import { MousePointer2Icon, UsersIcon, PercentIcon, LinkIcon } from "lucide-react"
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
 * Layout: 3 colunas de métricas + card de uso à direita (desktop)
 * Mobile: métricas empilham verticalmente, uso vai para o final
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
        {/* Desktop: Grid with usage on right */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[140px] animate-pulse rounded-xl border bg-muted"
            />
          ))}
          <div className="row-span-2 h-full min-h-[300px] animate-pulse rounded-xl border bg-muted" />
        </div>
        {/* Mobile: Stacked */}
        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[140px] animate-pulse rounded-xl border bg-muted"
            />
          ))}
          <div className="sm:col-span-2 h-[200px] animate-pulse rounded-xl border bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Desktop Layout: 4-column grid with usage card spanning 2 rows on right */}
      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4">
        {/* Row 1: First 3 metrics */}
        <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: "0ms" }}>
          <MetricCard
            label="Total de Cliques"
            value={formatNumber(metrics.totalClicks)}
            icon={MousePointer2Icon}
            trend={trends?.clicks}
            variant="blue"
          />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: "50ms" }}>
          <MetricCard
            label="Total de Leads"
            value={formatNumber(metrics.totalLeads)}
            icon={UsersIcon}
            trend={trends?.leads}
            variant="green"
          />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: "100ms" }}>
          <MetricCard
            label="Taxa de Conversão"
            value={formatPercentage(metrics.conversionRate)}
            icon={PercentIcon}
            trend={trends?.conversion}
            variant="purple"
          />
        </div>
        {/* Usage Card - spans 2 rows */}
        <div className="row-span-2 animate-in fade-in slide-in-from-right-4" style={{ animationDelay: "150ms" }}>
          <UsageCard
            current={usage.current}
            limit={usage.limit}
            planTier={usage.planTier}
            className="h-full"
          />
        </div>
        {/* Row 2: 4th metric spans remaining 3 columns but only uses 1 */}
        <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: "200ms" }}>
          <MetricCard
            label="Links Ativos"
            value={metrics.activeLinks}
            icon={LinkIcon}
            trend={trends?.activeLinks}
            variant="orange"
          />
        </div>
      </div>

      {/* Mobile/Tablet Layout: Stacked grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        <MetricCard
          label="Total de Cliques"
          value={formatNumber(metrics.totalClicks)}
          icon={MousePointer2Icon}
          trend={trends?.clicks}
          variant="blue"
        />
        <MetricCard
          label="Total de Leads"
          value={formatNumber(metrics.totalLeads)}
          icon={UsersIcon}
          trend={trends?.leads}
          variant="green"
        />
        <MetricCard
          label="Taxa de Conversão"
          value={formatPercentage(metrics.conversionRate)}
          icon={PercentIcon}
          trend={trends?.conversion}
          variant="purple"
        />
        <MetricCard
          label="Links Ativos"
          value={metrics.activeLinks}
          icon={LinkIcon}
          trend={trends?.activeLinks}
          variant="orange"
        />
        {/* Usage card at bottom on mobile */}
        <div className="sm:col-span-2">
          <UsageCard
            current={usage.current}
            limit={usage.limit}
            planTier={usage.planTier}
          />
        </div>
      </div>
    </div>
  )
}

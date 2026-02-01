"use client"

import * as React from "react"
import {
  LinkIcon,
  MousePointerClickIcon,
  TrendingUpIcon,
  ToggleRightIcon,
} from "lucide-react"
import { MetricCard } from "@/features/shared"
import { formatNumber, formatPercentage } from "@/features/shared/utils"
import { cn } from "@/lib/utils"
import type { LinkStats } from "../types"

export interface LinksStatsBannerProps {
  stats: LinkStats
  isLoading?: boolean
  className?: string
}

/**
 * Banner de estatísticas dos links
 */
export function LinksStatsBanner({
  stats,
  isLoading,
  className,
}: LinksStatsBannerProps) {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[120px] animate-pulse rounded-xl border bg-muted"
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      <MetricCard
        label="Total de Links"
        value={stats.totalLinks}
        icon={LinkIcon}
      />
      <MetricCard
        label="Total de Cliques"
        value={formatNumber(stats.totalClicks)}
        icon={MousePointerClickIcon}
        trend={stats.clicksTrend}
      />
      <MetricCard
        label="Taxa Média de Cliques"
        value={formatPercentage(stats.avgClickRate)}
        icon={TrendingUpIcon}
      />
      <MetricCard
        label="Links Ativos"
        value={`${stats.activeLinks}/${stats.totalLinks}`}
        icon={ToggleRightIcon}
      />
    </div>
  )
}

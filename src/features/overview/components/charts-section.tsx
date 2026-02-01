"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TopLinksTable } from "./top-links-table"
import { ConversionFunnel } from "./conversion-funnel"
import { GeoChart } from "./geo-chart"
import { ActivityFeed } from "./activity-feed"
import type {
  TopLinkData,
  FunnelData,
  GeoDataPoint,
  ActivityData,
  ClicksChartData,
  UtmChartData
} from "../types"

export interface ChartsSectionProps {
  /** Dados do gráfico de cliques (legacy) */
  clicksData?: ClicksChartData[]
  /** Dados do gráfico de UTM (legacy) */
  utmData?: UtmChartData[]
  /** Top links data */
  topLinks?: TopLinkData[]
  /** Funnel data */
  funnel?: FunnelData
  /** Geographic data */
  geoData?: GeoDataPoint[]
  /** Recent activity data */
  recentActivity?: ActivityData[]
  /** Estado de carregamento */
  isLoading?: boolean
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Seção de gráficos do dashboard - Overview
 * Exibe: Top Links, Funil de Conversão, Distribuição Geográfica, Atividade Recente
 */
export function ChartsSection({
  topLinks = [],
  funnel = { totalClicks: 0, totalLeads: 0, totalConversions: 0 },
  geoData = [],
  recentActivity = [],
  isLoading,
  className,
}: ChartsSectionProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Row 1: Top Links + Funnel */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-[380px] animate-pulse rounded-xl border bg-muted" />
          <div className="h-[380px] animate-pulse rounded-xl border bg-muted" />
        </div>
        {/* Row 2: Geo + Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-[320px] animate-pulse rounded-xl border bg-muted" />
          <div className="h-[320px] animate-pulse rounded-xl border bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Row 1: Top Links + Conversion Funnel */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopLinksTable links={topLinks} />
        <ConversionFunnel
          totalClicks={funnel.totalClicks}
          totalLeads={funnel.totalLeads}
          totalConversions={funnel.totalConversions}
        />
      </div>

      {/* Row 2: Geographic Distribution + Activity Feed */}
      <div className="grid gap-6 lg:grid-cols-2">
        <GeoChart data={geoData} />
        <ActivityFeed activities={recentActivity} />
      </div>
    </div>
  )
}

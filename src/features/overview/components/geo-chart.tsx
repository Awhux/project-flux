"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { GlobeIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatNumber } from "@/features/shared/utils"

interface GeoDataPoint {
  region: string
  /** Flag emoji for the region */
  flag: string
  clicks: number
  /** Percentage of total clicks */
  percentage: number
}

export interface GeoChartProps {
  /** Dados geográficos */
  data: GeoDataPoint[]
  /** Estado de carregamento */
  isLoading?: boolean
  /** Classes CSS adicionais */
  className?: string
}

const chartConfig = {
  clicks: {
    label: "Cliques",
    color: "hsl(var(--primary))",
  },
}

/**
 * Gráfico de distribuição geográfica
 * Exibe top regiões/países por cliques
 * 
 * Segue 70/10/10: 70% neutral (gray backgrounds), 10% primary (progress bars)
 */
export function GeoChart({
  data,
  isLoading,
  className,
}: GeoChartProps) {
  if (isLoading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Distribuição Geográfica</CardTitle>
          <CardDescription>Top regiões por cliques</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Distribuição Geográfica</CardTitle>
          <CardDescription>Top regiões por cliques</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <GlobeIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Dados geográficos não disponíveis
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Distribuição Geográfica</CardTitle>
        <CardDescription>Top regiões por cliques</CardDescription>
      </CardHeader>
      <CardContent>
        {/* List view for better readability */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.region} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.flag}</span>
                  <span className="font-medium">{item.region}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold tabular-nums">
                    {formatNumber(item.clicks)}
                  </span>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              {/* Progress bar - single primary color */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

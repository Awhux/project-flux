"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { BarChart3Icon } from "lucide-react"
import { cn } from "@/lib/utils"

interface LinkDataPoint {
  date: string
  [key: string]: number | string // Dynamic keys for each link
}

interface LinkInfo {
  slug: string
  color: string
}

export interface LinkComparisonChartProps {
  /** Dados de comparação */
  data: LinkDataPoint[]
  /** Informações dos links sendo comparados */
  links: LinkInfo[]
  /** Estado de carregamento */
  isLoading?: boolean
  /** Classes CSS adicionais */
  className?: string
}

// Predefined color palette for links
const LINK_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

/**
 * Gráfico de comparação de performance entre links
 * Multi-line chart comparando múltiplos links ao longo do tempo
 */
export function LinkComparisonChart({
  data,
  links,
  isLoading,
  className,
}: LinkComparisonChartProps) {
  if (isLoading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Comparação de Links</CardTitle>
          <CardDescription>Performance comparativa ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  if (links.length === 0 || data.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Comparação de Links</CardTitle>
          <CardDescription>Performance comparativa ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <BarChart3Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Selecione links para comparar
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Compare até 5 links simultaneamente
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Create chart config dynamically based on links
  const chartConfig: Record<string, { label: string; color: string }> = {}
  links.forEach((link, index) => {
    chartConfig[link.slug] = {
      label: `/${link.slug}`,
      color: link.color || LINK_COLORS[index % LINK_COLORS.length],
    }
  })

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Comparação de Links</CardTitle>
        <CardDescription>Performance comparativa ao longo do tempo</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--muted))" }}
                axisLine={{ stroke: "hsl(var(--muted))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--muted))" }}
                axisLine={{ stroke: "hsl(var(--muted))" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {links.map((link, index) => (
                <Line
                  key={link.slug}
                  type="monotone"
                  dataKey={link.slug}
                  stroke={link.color || LINK_COLORS[index % LINK_COLORS.length]}
                  strokeWidth={2}
                  dot={{ fill: link.color || LINK_COLORS[index % LINK_COLORS.length], r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Link Legend with stats */}
        <div className="mt-4 flex flex-wrap gap-3">
          {links.map((link, index) => {
            // Calculate total for each link
            const total = data.reduce((sum, point) => sum + (Number(point[link.slug]) || 0), 0)
            const color = link.color || LINK_COLORS[index % LINK_COLORS.length]

            return (
              <div
                key={link.slug}
                className="flex items-center gap-2 rounded-lg border px-3 py-1.5"
              >
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium">/{link.slug}</span>
                <span className="text-sm text-muted-foreground">
                  {total.toLocaleString()} cliques
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

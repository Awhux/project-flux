"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

interface UtmDataPoint {
  source: string
  clicks: number
}

export interface UtmBarChartProps {
  /** Dados do gráfico */
  data: UtmDataPoint[]
  /** Título do card */
  title?: string
  /** Descrição do card */
  description?: string
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
 * Gráfico de barras para exibir breakdown de UTM
 */
export function UtmBarChart({
  data,
  title = "Origem do Tráfego (UTM)",
  description = "Principais fontes de tráfego",
  className,
}: UtmBarChartProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="source"
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
              <Bar
                dataKey="clicks"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

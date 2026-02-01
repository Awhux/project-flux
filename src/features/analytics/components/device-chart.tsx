"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { cn } from "@/lib/utils"
import type { DeviceChartData } from "../types"

export interface DeviceChartProps {
  /** Dados do gráfico */
  data: DeviceChartData[]
  /** Classes CSS adicionais */
  className?: string
}

const DEVICE_COLORS: Record<string, string> = {
  Desktop: "hsl(var(--primary))",
  Mobile: "hsl(var(--chart-2))",
  Tablet: "hsl(var(--chart-3))",
  Outro: "hsl(var(--muted))",
  Other: "hsl(var(--muted))",
}

const chartConfig = {
  value: {
    label: "Cliques",
  },
}

/**
 * Gráfico de pizza para distribuição por dispositivo
 */
export function DeviceChart({ data, className }: DeviceChartProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Distribuição por Dispositivo</CardTitle>
        <CardDescription>Cliques por tipo de dispositivo</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="device"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ device, percent }) =>
                  `${device}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={DEVICE_COLORS[entry.device] || DEVICE_COLORS.Outro}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

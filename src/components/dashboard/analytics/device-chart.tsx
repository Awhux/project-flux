"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

interface DeviceChartProps {
  data: Array<{ device: string; value: number }>
}

const COLORS = {
  Desktop: "hsl(var(--primary))",
  Mobile: "hsl(var(--chart-2))",
  Tablet: "hsl(var(--chart-3))",
  Other: "hsl(var(--muted))",
}

const chartConfig = {
  value: {
    label: "Clicks",
  },
}

export function DeviceChart({ data }: DeviceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Distribution</CardTitle>
        <CardDescription>Clicks by device type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.device as keyof typeof COLORS] || COLORS.Other}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

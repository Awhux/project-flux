"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface HeatmapCell {
  day: number // 0-6 (Sunday to Saturday)
  hour: number // 0-23
  value: number
}

export interface TimeHeatmapProps {
  /** Dados do heatmap */
  data: HeatmapCell[]
  /** Estado de carregamento */
  isLoading?: boolean
  /** Classes CSS adicionais */
  className?: string
}

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const HOURS = Array.from({ length: 24 }, (_, i) => i)

// Get intensity class based on value relative to max
function getIntensityClass(value: number, maxValue: number): string {
  if (value === 0) return "bg-muted"
  const ratio = value / maxValue
  if (ratio < 0.2) return "bg-primary/20"
  if (ratio < 0.4) return "bg-primary/40"
  if (ratio < 0.6) return "bg-primary/60"
  if (ratio < 0.8) return "bg-primary/80"
  return "bg-primary"
}

/**
 * Heatmap de hora/dia da semana
 * Mostra quando os cliques acontecem mais
 */
export function TimeHeatmap({
  data,
  isLoading,
  className,
}: TimeHeatmapProps) {
  if (isLoading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Horários de Pico</CardTitle>
          <CardDescription>Quando os cliques acontecem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  // Create a map for quick lookup
  const dataMap = new Map<string, number>()
  data.forEach((cell) => {
    dataMap.set(`${cell.day}-${cell.hour}`, cell.value)
  })

  const maxValue = Math.max(...data.map((d) => d.value), 1)

  // Group hours for mobile (show 6 groups of 4 hours)
  const hourGroups = [
    { label: "0-3h", hours: [0, 1, 2, 3] },
    { label: "4-7h", hours: [4, 5, 6, 7] },
    { label: "8-11h", hours: [8, 9, 10, 11] },
    { label: "12-15h", hours: [12, 13, 14, 15] },
    { label: "16-19h", hours: [16, 17, 18, 19] },
    { label: "20-23h", hours: [20, 21, 22, 23] },
  ]

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Horários de Pico</CardTitle>
        <CardDescription>Quando os cliques acontecem</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Desktop view - full heatmap */}
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex mb-1 ml-12">
              {HOURS.filter((h) => h % 3 === 0).map((hour) => (
                <div
                  key={hour}
                  className="text-xs text-muted-foreground"
                  style={{ width: `${100 / 8}%` }}
                >
                  {hour.toString().padStart(2, "0")}h
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="space-y-1">
              {DAYS.map((day, dayIndex) => (
                <div key={day} className="flex items-center gap-2">
                  <span className="w-10 text-xs text-muted-foreground text-right">
                    {day}
                  </span>
                  <div className="flex-1 flex gap-0.5">
                    {HOURS.map((hour) => {
                      const value = dataMap.get(`${dayIndex}-${hour}`) || 0
                      return (
                        <div
                          key={hour}
                          className={cn(
                            "h-6 flex-1 rounded-sm transition-colors cursor-pointer hover:ring-2 hover:ring-primary/50",
                            getIntensityClass(value, maxValue)
                          )}
                          title={`${day} ${hour}:00 - ${value} cliques`}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <span className="text-xs text-muted-foreground">Menos</span>
              <div className="flex gap-0.5">
                <div className="h-4 w-4 rounded-sm bg-muted" />
                <div className="h-4 w-4 rounded-sm bg-primary/20" />
                <div className="h-4 w-4 rounded-sm bg-primary/40" />
                <div className="h-4 w-4 rounded-sm bg-primary/60" />
                <div className="h-4 w-4 rounded-sm bg-primary/80" />
                <div className="h-4 w-4 rounded-sm bg-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Mais</span>
            </div>
          </div>
        </div>

        {/* Mobile view - grouped hours */}
        <div className="md:hidden">
          <div className="space-y-2">
            {/* Header */}
            <div className="flex gap-1 ml-12">
              {hourGroups.map((group) => (
                <div
                  key={group.label}
                  className="flex-1 text-center text-xs text-muted-foreground"
                >
                  {group.label}
                </div>
              ))}
            </div>

            {/* Rows */}
            {DAYS.map((day, dayIndex) => (
              <div key={day} className="flex items-center gap-2">
                <span className="w-10 text-xs text-muted-foreground text-right">
                  {day}
                </span>
                <div className="flex-1 flex gap-1">
                  {hourGroups.map((group) => {
                    const groupValue = group.hours.reduce(
                      (sum, hour) => sum + (dataMap.get(`${dayIndex}-${hour}`) || 0),
                      0
                    )
                    return (
                      <div
                        key={group.label}
                        className={cn(
                          "h-8 flex-1 rounded transition-colors",
                          getIntensityClass(groupValue, maxValue * 4)
                        )}
                        title={`${day} ${group.label} - ${groupValue} cliques`}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-xs text-muted-foreground">Menos</span>
            <div className="flex gap-0.5">
              <div className="h-3 w-3 rounded-sm bg-muted" />
              <div className="h-3 w-3 rounded-sm bg-primary/40" />
              <div className="h-3 w-3 rounded-sm bg-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Mais</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

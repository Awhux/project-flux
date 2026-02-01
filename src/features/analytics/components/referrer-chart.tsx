"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GlobeIcon, ExternalLinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatNumber } from "@/features/shared/utils"

interface ReferrerData {
  domain: string
  clicks: number
  percentage: number
}

export interface ReferrerChartProps {
  /** Dados dos referrers */
  data: ReferrerData[]
  /** Estado de carregamento */
  isLoading?: boolean
  /** Classes CSS adicionais */
  className?: string
}

// Color palette for progress bars
const COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
]

/**
 * Gráfico de breakdown por referrer/domínio
 * Mostra de onde os cliques estão vindo
 */
export function ReferrerChart({
  data,
  isLoading,
  className,
}: ReferrerChartProps) {
  if (isLoading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Domínios de Origem</CardTitle>
          <CardDescription>Top referrers por cliques</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-2 w-full animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Domínios de Origem</CardTitle>
          <CardDescription>Top referrers por cliques</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <GlobeIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Nenhum dado de referrer disponível
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Domínios de Origem</CardTitle>
        <CardDescription>Top referrers por cliques</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.domain} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-xs">
                    {item.domain === "Direto" ? (
                      <GlobeIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <ExternalLinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <span className="truncate font-medium">{item.domain}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold tabular-nums">
                    {formatNumber(item.clicks)}
                  </span>
                  <span className="text-muted-foreground text-xs tabular-nums w-12 text-right">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    COLORS[index % COLORS.length]
                  )}
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

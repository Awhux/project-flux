"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon, ExternalLinkIcon, CopyIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatNumber } from "@/features/shared/utils"

interface TopLink {
  id: string
  slug: string
  clicks: number
  trend: {
    value: number
    isPositive: boolean
  }
  /** Sparkline data - array of click counts */
  sparkline: number[]
}

export interface TopLinksTableProps {
  /** Links a serem exibidos */
  links: TopLink[]
  /** Estado de carregamento */
  isLoading?: boolean
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Mini sparkline component for visualizing click trends
 */
function Sparkline({ data, className }: { data: number[]; className?: string }) {
  if (data.length < 2) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const height = 24
  const width = 60
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(" ")

  return (
    <svg
      width={width}
      height={height}
      className={cn("text-primary", className)}
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

/**
 * Tabela de links com melhor desempenho
 * Mostra top 5 links por cliques com sparkline de tendências
 */
export function TopLinksTable({
  links,
  isLoading,
  className,
}: TopLinksTableProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const handleCopy = async (slug: string, id: string) => {
    await navigator.clipboard.writeText(`https://zap.lk/${slug}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (isLoading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Links de Melhor Desempenho</CardTitle>
          <CardDescription>Top 5 por cliques nos últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Links de Melhor Desempenho</CardTitle>
        <CardDescription>Top 5 por cliques nos últimos 30 dias</CardDescription>
      </CardHeader>
      <CardContent>
        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum link com dados suficientes
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {links.map((link, index) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-muted/50 animate-in fade-in slide-in-from-left-2"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                {/* Rank + Slug */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="truncate text-sm font-medium">
                      zap.lk/{link.slug}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => handleCopy(link.slug, link.id)}
                    >
                      {copiedId === link.id ? (
                        <CheckIcon className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <CopyIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Sparkline */}
                <div className="hidden sm:block px-4">
                  <Sparkline data={link.sparkline} />
                </div>

                {/* Clicks + Trend */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold tabular-nums">
                    {formatNumber(link.clicks)}
                  </span>
                  <div className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    link.trend.isPositive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  )}>
                    {link.trend.isPositive ? (
                      <TrendingUpIcon className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDownIcon className="h-3.5 w-3.5" />
                    )}
                    <span>{Math.abs(link.trend.value)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MousePointer2Icon, UsersIcon, MessageSquareIcon, ArrowDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatNumber, formatPercentage } from "@/features/shared/utils"

interface FunnelStage {
  label: string
  value: number
  icon: React.ElementType
  color: string
}

export interface ConversionFunnelProps {
  /** Total de cliques */
  totalClicks: number
  /** Total de leads capturados */
  totalLeads: number
  /** Total de conversões para WhatsApp */
  totalConversions: number
  /** Estado de carregamento */
  isLoading?: boolean
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Visualização do funil de conversão
 * Click → Lead → WhatsApp Open
 */
export function ConversionFunnel({
  totalClicks,
  totalLeads,
  totalConversions,
  isLoading,
  className,
}: ConversionFunnelProps) {
  if (isLoading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Funil de Conversão</CardTitle>
          <CardDescription>Jornada do clique até o WhatsApp</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const leadRate = totalClicks > 0 ? (totalLeads / totalClicks) * 100 : 0
  const conversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0
  const overallRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

  const stages: FunnelStage[] = [
    {
      label: "Cliques",
      value: totalClicks,
      icon: MousePointer2Icon,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      label: "Leads Capturados",
      value: totalLeads,
      icon: UsersIcon,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      label: "WhatsApp Abertos",
      value: totalConversions,
      icon: MessageSquareIcon,
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    },
  ]

  // Calculate bar widths relative to the first stage
  const maxValue = stages[0].value
  const getBarWidth = (value: number) => {
    if (maxValue === 0) return 100
    return Math.max((value / maxValue) * 100, 10)
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Funil de Conversão</CardTitle>
            <CardDescription>Jornada do clique até o WhatsApp</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatPercentage(overallRate)}
            </p>
            <p className="text-xs text-muted-foreground">Conversão geral</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.label}>
              <div
                className="space-y-2 animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg transition-transform hover:scale-105", stage.color)}>
                      <stage.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{stage.label}</p>
                      <p className="text-2xl font-bold">{formatNumber(stage.value)}</p>
                    </div>
                  </div>
                  {index > 0 && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">
                        {index === 1 ? formatPercentage(leadRate) : formatPercentage(conversionRate)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {index === 1 ? "da etapa anterior" : "da etapa anterior"}
                      </p>
                    </div>
                  )}
                </div>
                {/* Progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      index === 0 ? "bg-blue-500" : index === 1 ? "bg-purple-500" : "bg-green-500"
                    )}
                    style={{ width: `${getBarWidth(stage.value)}%` }}
                  />
                </div>
              </div>
              {/* Arrow connector */}
              {index < stages.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDownIcon className="h-5 w-5 text-muted-foreground/50" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowUpIcon, ArrowDownIcon, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const metricCardVariants = cva(
  "relative flex flex-col rounded-xl border bg-card transition-all duration-200 hover:shadow-sm",
  {
    variants: {
      size: {
        default: "p-4",
        compact: "p-4",
        large: "p-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const metricIconVariants = cva(
  "flex items-center justify-center rounded-lg bg-muted/50 text-muted-foreground",
  {
    variants: {
      size: {
        default: "h-12 w-12",
        compact: "h-10 w-10",
        large: "h-14 w-14",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface TrendIndicator {
  value: number
  isPositive: boolean
}

export interface MetricCardProps
  extends VariantProps<typeof metricCardVariants> {
  /** Rótulo exibido acima do valor */
  label: string
  /** Valor principal a ser exibido */
  value: string | number
  /** Componente de ícone Lucide (opcional - usar apenas para métricas críticas) */
  icon?: LucideIcon
  /** Indicador de tendência opcional */
  trend?: TrendIndicator
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Componente de card de métrica simplificado com 70/10/10 color priorities
 * Usado para exibir métricas chave no dashboard
 * 
 * 70% neutral (white/gray), 10% primary (subtle highlights), 10% accent (status)
 */
export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  size,
  className,
}: MetricCardProps) {
  return (
    <div className={cn(metricCardVariants({ size }), className)}>
      <div className="flex items-center justify-between">
        {/* Lado esquerdo: Rótulo e Valor */}
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
        </div>

        {/* Lado direito: Ícone (opcional, apenas para métricas críticas) */}
        {Icon && (
          <div className={cn(metricIconVariants({ size }))}>
            <Icon className={cn(size === "compact" ? "h-5 w-5" : "h-6 w-6")} />
          </div>
        )}
      </div>

      {/* Indicador de Tendência (10% accent - functional color) */}
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          {trend.isPositive ? (
            <ArrowUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
          )}
          <span
            className={cn(
              "text-sm font-medium",
              trend.isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {Math.abs(trend.value)}%
          </span>
          <span className="text-sm text-muted-foreground">vs mês anterior</span>
        </div>
      )}
    </div>
  )
}

export { metricCardVariants, metricIconVariants }

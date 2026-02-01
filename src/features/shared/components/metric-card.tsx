"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowUpIcon, ArrowDownIcon, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const metricCardVariants = cva(
  "relative flex flex-col rounded-xl border transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border bg-card",
        blue: "border-blue-200 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20",
        green: "border-green-200 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20",
        purple: "border-purple-200 bg-purple-50/50 dark:border-purple-800/50 dark:bg-purple-950/20",
        orange: "border-orange-200 bg-orange-50/50 dark:border-orange-800/50 dark:bg-orange-950/20",
      },
      size: {
        default: "p-4",
        compact: "p-4",
        large: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const metricIconVariants = cva(
  "flex items-center justify-center rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        blue: "bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
        green: "bg-green-600/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
        purple: "bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
        orange: "bg-orange-600/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
      },
      size: {
        default: "h-12 w-12",
        compact: "h-10 w-10",
        large: "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
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
  /** Componente de ícone Lucide */
  icon: LucideIcon
  /** Indicador de tendência opcional */
  trend?: TrendIndicator
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Componente de card de métrica com variantes CVA
 * Usado para exibir métricas chave no dashboard
 */
export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  variant,
  size,
  className,
}: MetricCardProps) {
  return (
    <div className={cn(metricCardVariants({ variant, size }), className)}>
      <div className="flex items-center justify-between">
        {/* Lado esquerdo: Rótulo e Valor */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
        </div>

        {/* Lado direito: Ícone */}
        <div className={cn(metricIconVariants({ variant, size }))}>
          <Icon className={cn(size === "compact" ? "h-5 w-5" : "h-6 w-6")} />
        </div>
      </div>

      {/* Indicador de Tendência */}
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

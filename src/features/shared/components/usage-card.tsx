"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircleIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatNumber } from "../utils/format-number"

const planBadgeVariants = cva(
  "font-semibold",
  {
    variants: {
      tier: {
        FREE: "bg-muted text-muted-foreground",
        PRO: "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0",
        AGENCY: "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0",
      },
    },
    defaultVariants: {
      tier: "FREE",
    },
  }
)

type PlanTier = "FREE" | "PRO" | "AGENCY"

export interface UsageCardProps {
  /** Uso atual */
  current: number
  /** Limite do plano */
  limit: number
  /** Nível do plano */
  planTier: PlanTier
  /** Variante do layout */
  variant?: "default" | "horizontal"
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Card de indicador de uso do plano
 * Mostra o consumo atual e alerta quando próximo do limite
 * 
 * Variantes:
 * - default: Layout vertical tradicional
 * - horizontal: Layout compacto em linha única para uso abaixo das métricas
 */
export function UsageCard({
  current,
  limit,
  planTier,
  variant = "default",
  className
}: UsageCardProps) {
  const percentage = (current / limit) * 100
  const remaining = limit - current

  // Labels em português baseados no plano
  const planLabels: Record<PlanTier, string> = {
    FREE: "Plano Gratuito",
    PRO: "Plano Pro",
    AGENCY: "Plano Agência",
  }

  // Determina a cor baseada no uso
  const getProgressColor = () => {
    if (percentage <= 70) return "bg-primary"
    if (percentage <= 90) return "bg-yellow-500"
    return "bg-destructive"
  }

  const showWarning = percentage >= 80

  // Horizontal variant - compact single row layout
  if (variant === "horizontal") {
    return (
      <Card className={cn("", className)}>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Title and Badge */}
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg">Uso Este Mês</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {planLabels[planTier]}: {formatNumber(limit)} cliques/mês
              </CardDescription>
            </div>
            <Badge className={cn(planBadgeVariants({ tier: planTier }), "shrink-0")}>
              {planTier}
            </Badge>
          </div>

          {/* Center: Progress Bar */}
          <div className="flex-1 space-y-1 sm:max-w-md">
            <Progress value={percentage} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                {formatNumber(current)} cliques
              </span>
              <span>{formatNumber(remaining)} restantes</span>
            </div>
          </div>

          {/* Right: Warning or Upgrade CTA */}
          {showWarning && planTier === "FREE" && (
            <div className="flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-2">
              <AlertCircleIcon className="h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
              <p className="text-xs font-medium text-yellow-900 dark:text-yellow-100">
                Próximo do limite
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Default vertical variant
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Uso Este Mês</CardTitle>
            <CardDescription>
              {planLabels[planTier]}: {formatNumber(limit)} cliques/mês
            </CardDescription>
          </div>
          <Badge className={cn(planBadgeVariants({ tier: planTier }))}>
            {planTier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de Progresso */}
        <div className="space-y-2">
          <Progress value={percentage} className="h-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">
              {formatNumber(current)} cliques
            </span>
            <span className="text-muted-foreground">
              {formatNumber(remaining)} restantes
            </span>
          </div>
        </div>

        {/* Aviso de Limite */}
        {showWarning && planTier === "FREE" && (
          <div className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
            <AlertCircleIcon className="h-5 w-5 shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
            <div className="space-y-1 text-sm">
              <p className="font-medium text-yellow-900 dark:text-yellow-100">
                Aproximando do limite
              </p>
              <p className="text-yellow-800 dark:text-yellow-200">
                Faça upgrade para o Pro e tenha cliques ilimitados
              </p>
            </div>
          </div>
        )}

        {/* Botão de Upgrade */}
        {planTier === "FREE" && (
          <Button className="w-full" variant="default">
            Fazer Upgrade para Pro
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export { planBadgeVariants }

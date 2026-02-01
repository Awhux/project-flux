"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PlanInfo } from "../types"

const planCardVariants = cva(
  "rounded-lg border p-6 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border",
        highlighted: "border-primary bg-primary/5",
        current: "border-border bg-muted/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface PlanCardProps extends VariantProps<typeof planCardVariants> {
  /** Informações do plano */
  plan: PlanInfo
  /** Callback ao selecionar o plano */
  onSelect?: (planId: string) => void
  /** Se está carregando */
  isLoading?: boolean
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Card de exibição de plano com CVA variants
 */
export function PlanCard({
  plan,
  onSelect,
  isLoading = false,
  className,
}: PlanCardProps) {
  const variant = plan.isCurrentPlan
    ? "current"
    : plan.isHighlighted
      ? "highlighted"
      : "default"

  return (
    <div className={cn(planCardVariants({ variant }), className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold sm:text-2xl">{plan.name}</h3>
            {plan.isCurrentPlan && (
              <Badge variant="secondary">ATUAL</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {plan.features.join(" • ")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold sm:text-3xl">
            {plan.price === 0 ? "Grátis" : `R$${plan.price}`}
          </p>
          {plan.price > 0 && (
            <p className="text-sm text-muted-foreground">/mês</p>
          )}
        </div>
      </div>

      {!plan.isCurrentPlan && onSelect && (
        <Button
          className="w-full"
          size="lg"
          variant={plan.isHighlighted ? "default" : "outline"}
          onClick={() => onSelect(plan.id)}
          disabled={isLoading}
        >
          {isLoading ? "Processando..." : `Assinar ${plan.name}`}
        </Button>
      )}
    </div>
  )
}

export { planCardVariants }

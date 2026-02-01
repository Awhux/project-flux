"use client"

import * as React from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { EmptyState } from "@/features/shared"
import { PlanCard } from "./plan-card"
import type { PlanInfo, BillingHistoryItem } from "../types"

export interface PlanTabProps {
  /** Lista de planos disponíveis */
  plans: PlanInfo[]
  /** Histórico de cobrança */
  billingHistory: BillingHistoryItem[]
  /** Callback ao selecionar um plano */
  onPlanSelect: (planId: string) => void
  /** Se está processando upgrade */
  isUpgrading?: boolean
}

/**
 * Tab de plano e cobrança
 */
export function PlanTab({
  plans,
  billingHistory,
  onPlanSelect,
  isUpgrading = false,
}: PlanTabProps) {
  const currentPlan = plans.find((p) => p.isCurrentPlan)
  const otherPlans = plans.filter((p) => !p.isCurrentPlan)

  return (
    <TabsContent value="plan" className="space-y-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Plano Atual</CardTitle>
          <CardDescription>Gerencie seu plano de assinatura</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentPlan && <PlanCard plan={currentPlan} />}

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold">Fazer Upgrade</h4>
            {otherPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSelect={onPlanSelect}
                isLoading={isUpgrading}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Cobrança</CardTitle>
          <CardDescription>Suas faturas e recibos anteriores</CardDescription>
        </CardHeader>
        <CardContent>
          {billingHistory.length > 0 ? (
            <div className="space-y-4">
              {billingHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R${item.amount}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {item.status === "paid" ? "Pago" : item.status === "pending" ? "Pendente" : "Falhou"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum histórico"
              description="Nenhum histórico de cobrança disponível"
              size="compact"
            />
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}

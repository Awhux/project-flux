"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UtmBarChart } from "@/features/shared"
import { EmptyState } from "@/features/shared"
import { utmTabOptions } from "../config/analytics.config"
import { cn } from "@/lib/utils"
import type { UtmChartData, UtmTab } from "../types"

export interface UtmTabsProps {
  /** Dados de UTM Source */
  sourceData: UtmChartData[]
  /** Dados de UTM Medium */
  mediumData: UtmChartData[]
  /** Dados de UTM Campaign */
  campaignData: UtmChartData[]
  /** Dados de UTM Content */
  contentData?: UtmChartData[]
  /** Tab padrão selecionada */
  defaultTab?: UtmTab
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Tabs de breakdown de UTM com gráficos de barras
 */
export function UtmTabs({
  sourceData,
  mediumData,
  campaignData,
  contentData = [],
  defaultTab = "source",
  className,
}: UtmTabsProps) {
  const getTabData = (tab: UtmTab): UtmChartData[] => {
    switch (tab) {
      case "source":
        return sourceData
      case "medium":
        return mediumData
      case "campaign":
        return campaignData
      case "content":
        return contentData
      default:
        return []
    }
  }

  const getTabDescription = (tab: UtmTab): string => {
    switch (tab) {
      case "source":
        return "Principais fontes de tráfego"
      case "medium":
        return "Mídias de origem do tráfego"
      case "campaign":
        return "Desempenho por campanha"
      case "content":
        return "Variações de conteúdo"
      default:
        return ""
    }
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Parâmetros UTM</CardTitle>
        <CardDescription>Análise de tráfego por parâmetros UTM</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            {utmTabOptions.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {utmTabOptions.map((tab) => {
            const data = getTabData(tab.value as UtmTab)
            return (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
                {data.length > 0 ? (
                  <div className="h-[250px] sm:h-[300px]">
                    <UtmBarChart
                      data={data}
                      title=""
                      description={getTabDescription(tab.value as UtmTab)}
                      className="border-0 shadow-none"
                    />
                  </div>
                ) : (
                  <EmptyState
                    title="Sem dados disponíveis"
                    description={`Nenhum dado de ${tab.label.toLowerCase()} encontrado para o período selecionado.`}
                    size="compact"
                  />
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}

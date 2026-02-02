"use client"

import * as React from "react"
import { DownloadIcon, RefreshCwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/features/shared"
import { AnalyticsFilters } from "./analytics-filters"
import type { DateRange } from "../types"

export interface AnalyticsHeaderProps {
  /** Período selecionado */
  dateRange: DateRange
  /** Callback para mudança de período */
  onDateRangeChange: (value: DateRange) => void
  /** Link selecionado */
  selectedLink: string
  /** Callback para mudança de link */
  onLinkChange: (value: string) => void
  /** Callback para exportar relatório */
  onExport: () => void
  /** Se está exportando */
  isExporting?: boolean
  /** Callback para atualizar dados */
  onRefresh?: () => void
  /** Se está atualizando */
  isRefreshing?: boolean
}

/**
 * Cabeçalho da página de análises com filtros e ação de exportar
 */
export function AnalyticsHeader({
  dateRange,
  onDateRangeChange,
  selectedLink,
  onLinkChange,
  onExport,
  isExporting = false,
  onRefresh,
  isRefreshing = false,
}: AnalyticsHeaderProps) {
  return (
    <PageHeader
      title="Análises"
      description="Insights detalhados sobre o desempenho dos seus links"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <AnalyticsFilters
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            selectedLink={selectedLink}
            onLinkChange={onLinkChange}
          />
          {onRefresh && (
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Atualizar dados"
            >
              <RefreshCwIcon
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          )}
          <Button variant="outline" onClick={onExport} disabled={isExporting}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            {isExporting ? "Exportando..." : "Exportar Relatório"}
          </Button>
        </div>
      }
    />
  )
}

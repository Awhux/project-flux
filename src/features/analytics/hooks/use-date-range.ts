"use client"

import * as React from "react"
import type { DateRange } from "../types"

interface UseDateRangeReturn {
  /** Período selecionado */
  dateRange: DateRange
  /** Atualiza o período selecionado */
  setDateRange: (value: DateRange) => void
  /** Reseta para o período padrão */
  resetDateRange: () => void
  /** Obtém a descrição legível do período */
  getDateRangeLabel: () => string
}

const DEFAULT_DATE_RANGE: DateRange = "30"

/**
 * Hook para gerenciar o estado do período selecionado
 */
export function useDateRange(initialValue?: DateRange): UseDateRangeReturn {
  const [dateRange, setDateRange] = React.useState<DateRange>(
    initialValue ?? DEFAULT_DATE_RANGE
  )

  const resetDateRange = React.useCallback(() => {
    setDateRange(DEFAULT_DATE_RANGE)
  }, [])

  const getDateRangeLabel = React.useCallback((): string => {
    switch (dateRange) {
      case "7":
        return "Últimos 7 dias"
      case "30":
        return "Últimos 30 dias"
      case "90":
        return "Últimos 90 dias"
      default:
        return "Período selecionado"
    }
  }, [dateRange])

  return {
    dateRange,
    setDateRange,
    resetDateRange,
    getDateRangeLabel,
  }
}

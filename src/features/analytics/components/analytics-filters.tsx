"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { dateRangeOptions, linkFilterOptions } from "../config/analytics.config"
import type { DateRange } from "../types"

export interface AnalyticsFiltersProps {
  /** Período selecionado */
  dateRange: DateRange
  /** Callback para mudança de período */
  onDateRangeChange: (value: DateRange) => void
  /** Link selecionado */
  selectedLink: string
  /** Callback para mudança de link */
  onLinkChange: (value: string) => void
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Filtros de período e link para a página de análises
 */
export function AnalyticsFilters({
  dateRange,
  onDateRangeChange,
  selectedLink,
  onLinkChange,
}: AnalyticsFiltersProps) {
  return (
    <>
      <Select
        value={selectedLink}
        onValueChange={onLinkChange}
        items={linkFilterOptions}
      >
        <SelectTrigger className="w-[160px] sm:w-[180px]">
          <SelectValue placeholder="Selecionar link" />
        </SelectTrigger>
        <SelectContent>
          {linkFilterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={dateRange}
        onValueChange={onDateRangeChange}
        items={dateRangeOptions}
      >
        <SelectTrigger className="w-[120px] sm:w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {dateRangeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}

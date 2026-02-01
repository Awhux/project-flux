"use client"

import * as React from "react"
import { DownloadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/features/shared"
import { dateFilterOptions, linkFilterOptions } from "../config"
import type { DateFilter } from "../types"

export interface LeadsHeaderProps {
  linkFilter: string
  onLinkFilterChange: (filter: string) => void
  dateFilter: DateFilter
  onDateFilterChange: (filter: DateFilter) => void
  onExport: () => void
  totalLeads: number
}

/**
 * Cabeçalho da página de leads com filtros
 */
export function LeadsHeader({
  linkFilter,
  onLinkFilterChange,
  dateFilter,
  onDateFilterChange,
  onExport,
  totalLeads,
}: LeadsHeaderProps) {
  return (
    <div className="space-y-4 lg:space-y-6">
      <PageHeader
        title="Leads Capturados"
        description="Leads capturados através do Modo Ghost"
        actions={
          <Button variant="outline" onClick={onExport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
            <span className="sm:hidden">Exportar</span>
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{totalLeads}</span>{" "}
          lead{totalLeads !== 1 ? "s" : ""} encontrado{totalLeads !== 1 ? "s" : ""}
        </p>

        <div className="flex gap-2">
          <Select
            value={linkFilter}
            onValueChange={onLinkFilterChange}
            items={linkFilterOptions}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Todos os Links" />
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
            value={dateFilter}
            onValueChange={(v) => onDateFilterChange(v as DateFilter)}
            items={dateFilterOptions}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Todo Período" />
            </SelectTrigger>
            <SelectContent>
              {dateFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

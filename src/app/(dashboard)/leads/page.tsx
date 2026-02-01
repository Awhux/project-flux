"use client"

import * as React from "react"
import {
  LeadsHeader,
  LeadsTable,
  useLeads,
  exportLeadsToCSV,
} from "@/features/leads"
import { toast } from "sonner"

/**
 * Página de leads capturados
 * Exibe leads do Modo Ghost com filtros e exportação
 */
export default function LeadsPage() {
  const {
    leads,
    displayLeads,
    isLoading,
    linkFilter,
    setLinkFilter,
    dateFilter,
    setDateFilter,
  } = useLeads()

  const handleExport = () => {
    if (leads.length === 0) {
      toast.info("Nenhum lead para exportar")
      return
    }
    exportLeadsToCSV(leads)
    toast.success("Leads exportados com sucesso")
  }

  const handleViewDetails = (id: string) => {
    toast.info("Detalhes do lead em breve")
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho com filtros */}
      <LeadsHeader
        linkFilter={linkFilter}
        onLinkFilterChange={setLinkFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onExport={handleExport}
        totalLeads={leads.length}
      />

      {/* Tabela de leads */}
      <LeadsTable
        leads={displayLeads}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
      />
    </div>
  )
}

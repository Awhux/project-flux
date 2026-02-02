"use client"

import * as React from "react"
import {
  LeadsHeader,
  LeadsTable,
  useLeadsQuery,
  exportLeadsToCSV,
} from "@/features/leads"
import { useUserLinksQuery } from "@/features/analytics/hooks"
import { transformApiLeadForDisplay } from "@/features/leads/utils"
import { toast } from "sonner"
import type { DateFilter } from "@/features/leads/types"

/**
 * Página de leads capturados
 * Exibe leads do Modo Ghost com filtros e exportação
 */
export default function LeadsPage() {
  const [linkFilter, setLinkFilter] = React.useState("all")
  const [dateFilter, setDateFilter] = React.useState<DateFilter>("all")

  // Fetch leads data with filters
  const {
    data: leadsData,
    isLoading: isLoadingLeads,
    error: leadsError,
  } = useLeadsQuery({
    linkFilter,
    dateRange: dateFilter,
    page: 1,
  })

  // Fetch user links for filter dropdown
  const { data: userLinks, isLoading: isLoadingLinks } = useUserLinksQuery()

  // Transform leads for display
  const displayLeads = React.useMemo(() => {
    if (!leadsData?.leads) return []
    return leadsData.leads.map(transformApiLeadForDisplay)
  }, [leadsData?.leads])

  // Show error toast if query fails
  React.useEffect(() => {
    if (leadsError) {
      toast.error(leadsError.message || "Erro ao carregar leads")
    }
  }, [leadsError])

  const handleExport = () => {
    if (!leadsData?.leads || leadsData.leads.length === 0) {
      toast.info("Nenhum lead para exportar")
      return
    }

    // Convert API leads to domain leads for export
    const leadsForExport = leadsData.leads.map(apiLead => ({
      id: apiLead.id,
      name: apiLead.name,
      email: apiLead.email,
      phone: apiLead.phone,
      linkId: apiLead.linkId,
      linkSlug: apiLead.linkSlug,
      utmSource: apiLead.utmSource,
      utmMedium: apiLead.utmMedium,
      utmCampaign: apiLead.utmCampaign,
      utmContent: apiLead.utmContent,
      convertedAt: new Date(apiLead.convertedAt),
    }))

    exportLeadsToCSV(leadsForExport)
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
        totalLeads={leadsData?.pagination.totalItems || 0}
        userLinks={userLinks}
        isLoadingLinks={isLoadingLinks}
      />

      {/* Tabela de leads */}
      <LeadsTable
        leads={displayLeads}
        isLoading={isLoadingLeads}
        onViewDetails={handleViewDetails}
      />
    </div>
  )
}

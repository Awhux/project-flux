"use client"

import * as React from "react"
import type { Lead, DisplayLead, DateFilter } from "../types"
import { mockLeads } from "../config"
import { transformLeadForDisplay } from "../utils"

interface UseLeadsReturn {
  leads: Lead[]
  displayLeads: DisplayLead[]
  isLoading: boolean
  linkFilter: string
  setLinkFilter: (filter: string) => void
  dateFilter: DateFilter
  setDateFilter: (filter: DateFilter) => void
}

/**
 * Hook para gerenciar dados de leads
 */
export function useLeads(): UseLeadsReturn {
  const [leads] = React.useState<Lead[]>(mockLeads)
  const [isLoading, setIsLoading] = React.useState(true)
  const [linkFilter, setLinkFilter] = React.useState("all")
  const [dateFilter, setDateFilter] = React.useState<DateFilter>("all")

  // Simulate initial load
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Filter leads
  const filteredLeads = React.useMemo(() => {
    let result = [...leads]

    // Filter by link
    if (linkFilter !== "all") {
      result = result.filter((lead) => lead.link === linkFilter)
    }

    // Filter by date
    if (dateFilter !== "all") {
      const days = parseInt(dateFilter)
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - days)
      result = result.filter((lead) => lead.capturedAt >= cutoff)
    }

    // Sort by most recent
    result.sort((a, b) => b.capturedAt.getTime() - a.capturedAt.getTime())

    return result
  }, [leads, linkFilter, dateFilter])

  // Transform for display
  const displayLeads = React.useMemo<DisplayLead[]>(() => {
    return filteredLeads.map(transformLeadForDisplay)
  }, [filteredLeads])

  return {
    leads: filteredLeads,
    displayLeads,
    isLoading,
    linkFilter,
    setLinkFilter,
    dateFilter,
    setDateFilter,
  }
}

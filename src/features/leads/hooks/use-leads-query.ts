"use client"

import { useQuery } from "@tanstack/react-query"
import type {
  ListLeadsResponse,
  ApiLead,
  LeadStats,
  DateFilter,
} from "../types"
import type { PaginationInfo } from "@/features/links/types/api.types"

export interface UseLeadsQueryOptions {
  /** Link ID to filter by ("all" for all links) */
  linkFilter: string
  /** Date range filter */
  dateRange: DateFilter
  /** Page number (1-indexed) */
  page?: number
}

export interface LeadsQueryData {
  leads: ApiLead[]
  stats: LeadStats
  pagination: PaginationInfo
}

/**
 * Fetch leads data from the API
 */
async function fetchLeads(
  linkFilter: string,
  dateRange: DateFilter,
  page: number
): Promise<LeadsQueryData> {
  const params = new URLSearchParams({
    dateRange,
    page: page.toString(),
  })

  if (linkFilter !== "all") {
    params.set("linkId", linkFilter)
  }

  const response = await fetch(`/api/leads?${params.toString()}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData?.error?.message || "Erro ao carregar leads")
  }

  const data: ListLeadsResponse = await response.json()
  return data
}

/**
 * Hook to fetch leads using TanStack Query
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLeadsQuery({
 *   linkFilter: "all",
 *   dateRange: "30",
 *   page: 1,
 * })
 * ```
 */
export function useLeadsQuery({
  linkFilter,
  dateRange,
  page = 1,
}: UseLeadsQueryOptions) {
  return useQuery({
    queryKey: leadsQueryKeys.byFilters(linkFilter, dateRange, page),
    queryFn: () => fetchLeads(linkFilter, dateRange, page),
    // Use default behaviors from QueryProvider
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  })
}

// Query keys for leads (useful for invalidation)
export const leadsQueryKeys = {
  all: ["leads"] as const,
  byFilters: (linkId: string, dateRange: DateFilter, page: number) =>
    ["leads", linkId, dateRange, page] as const,
}

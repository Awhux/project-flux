"use client"

import { useQuery } from "@tanstack/react-query"
import type { OverviewApiResponse } from "../types"

export type DateRange = "7" | "30" | "90"

async function fetchOverview(dateRange: DateRange): Promise<OverviewApiResponse> {
  const searchParams = new URLSearchParams({ dateRange })
  const response = await fetch(`/api/overview?${searchParams.toString()}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData?.error?.message || "Failed to fetch overview data")
  }

  return response.json()
}

export const overviewQueryKeys = {
  all: ["overview"] as const,
  byDateRange: (dateRange: DateRange) => ["overview", dateRange] as const,
}

export function useOverviewQuery(dateRange: DateRange = "30") {
  return useQuery({
    queryKey: overviewQueryKeys.byDateRange(dateRange),
    queryFn: () => fetchOverview(dateRange),
    // Data is considered fresh for 0 seconds (always fetch fresh data on mount)
    staleTime: 0,
    // Don't refetch on window focus to avoid flash
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  })
}

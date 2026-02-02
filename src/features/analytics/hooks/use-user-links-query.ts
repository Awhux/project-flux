"use client"

import { useQuery } from "@tanstack/react-query"

export interface LinkOption {
  id: string
  slug: string
  clickCount: number
}

interface LinksResponse {
  links: LinkOption[]
}

/**
 * Fetch user's links from the API
 */
async function fetchUserLinks(): Promise<LinkOption[]> {
  const response = await fetch("/api/analytics/links")

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData?.error?.message || "Erro ao carregar links")
  }

  const data: LinksResponse = await response.json()
  return data.links
}

/**
 * Hook para buscar links do usuário usando TanStack Query
 *
 * @example
 * ```tsx
 * const { data: links, isLoading } = useUserLinksQuery()
 * ```
 */
export function useUserLinksQuery() {
  return useQuery({
    queryKey: ["analytics", "links"] as const,
    queryFn: fetchUserLinks,
    // Links don't change frequently, cache for longer
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

// Query keys for user links
export const userLinksQueryKeys = {
  all: ["analytics", "links"] as const,
}

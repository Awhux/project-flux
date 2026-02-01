"use client"

import * as React from "react"
import type { Link, StatusFilter, SortOption } from "../types"
import { useDebounce } from "@/hooks/use-debounce"

interface UseLinksFiltersReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: StatusFilter
  setStatusFilter: (status: StatusFilter) => void
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
  filteredLinks: Link[]
  resetFilters: () => void
}

interface UseLinksFiltersOptions {
  links: Link[]
  onFiltersChange?: () => void
}

/**
 * Hook para gerenciar filtros e ordenação de links
 */
export function useLinksFilters({
  links,
  onFiltersChange,
}: UseLinksFiltersOptions): UseLinksFiltersReturn {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [sortBy, setSortBy] = React.useState<SortOption>("newest")

  const debouncedSearch = useDebounce(searchQuery, 300)

  // Filter and sort links
  const filteredLinks = React.useMemo(() => {
    let result = [...links]

    // Apply search filter
    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase()
      result = result.filter(
        (link) =>
          link.slug.toLowerCase().includes(search) ||
          link.destination.toLowerCase().includes(search)
      )
    }

    // Apply status filter
    if (statusFilter === "active") {
      result = result.filter((link) => link.active)
    } else if (statusFilter === "inactive") {
      result = result.filter((link) => !link.active)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case "oldest":
        result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case "most-clicks":
        result.sort((a, b) => b.clicks - a.clicks)
        break
      case "least-clicks":
        result.sort((a, b) => a.clicks - b.clicks)
        break
      case "a-z":
        result.sort((a, b) => a.slug.localeCompare(b.slug))
        break
      case "z-a":
        result.sort((a, b) => b.slug.localeCompare(a.slug))
        break
    }

    return result
  }, [links, debouncedSearch, statusFilter, sortBy])

  // Reset pagination when filters change
  React.useEffect(() => {
    onFiltersChange?.()
  }, [debouncedSearch, statusFilter, sortBy, onFiltersChange])

  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setSortBy("newest")
  }

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    filteredLinks,
    resetFilters,
  }
}

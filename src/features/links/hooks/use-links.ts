"use client"

import * as React from "react"
import type { Link, LinkFormData, LinkStats, DisplayLink, StatusFilter, SortOption } from "../types"
import type { ListLinksResponse, ApiLink, BulkOperationResponse } from "../types/api.types"
import { ITEMS_PER_PAGE } from "../config"
import { formatRelativeDate } from "../utils"
import { toast } from "sonner"

interface UseLinksReturn {
  links: Link[]
  displayLinks: DisplayLink[]
  stats: LinkStats
  isLoading: boolean
  isRefetching: boolean
  error: string | null
  currentPage: number
  totalPages: number
  totalItems: number
  setCurrentPage: (page: number) => void
  createLink: (data: LinkFormData) => Promise<void>
  updateLink: (id: string, data: Partial<Link>) => void
  deleteLink: (id: string) => Promise<void>
  toggleActive: (id: string) => Promise<void>
  duplicateLink: (id: string) => Promise<void>
  bulkDelete: (ids: string[]) => Promise<void>
  bulkEnable: (ids: string[]) => Promise<void>
  bulkDisable: (ids: string[]) => Promise<void>
  previewLink: (slug: string, ghostMode: boolean) => void
  refetch: () => Promise<void>
}

interface UseLinksOptions {
  search?: string
  status?: StatusFilter
  sortBy?: SortOption
}

/**
 * Convert API link to frontend Link type
 */
function apiLinkToFrontendLink(apiLink: ApiLink): Link {
  return {
    id: apiLink.id,
    slug: apiLink.slug,
    destination: apiLink.destination,
    message: apiLink.message,
    clicks: apiLink.clicks,
    trend: { value: 0, isPositive: true }, // TODO: Calculate from analytics
    active: apiLink.active,
    ghostMode: apiLink.ghostMode,
    pixelId: apiLink.pixelId,
    createdAt: new Date(apiLink.createdAt),
  }
}

/**
 * Hook para gerenciar operações CRUD de links
 * Now uses real API endpoints instead of mock data
 */
export function useLinks({
  search = "",
  status = "all",
  sortBy = "newest",
}: UseLinksOptions = {}): UseLinksReturn {
  const [links, setLinks] = React.useState<Link[]>([])
  const [stats, setStats] = React.useState<LinkStats>({
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0,
    avgClickRate: 0,
  })
  const [isLoading, setIsLoading] = React.useState(true)
  const [isRefetching, setIsRefetching] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalItems, setTotalItems] = React.useState(0)

  /**
   * Fetch links from API
   */
  const fetchLinks = React.useCallback(
    async (page: number = 1, isRefetch: boolean = false) => {
      if (isRefetch) {
        setIsRefetching(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(ITEMS_PER_PAGE),
          status,
          sortBy,
        })

        if (search) {
          params.set("search", search)
        }

        const response = await fetch(`/api/links?${params}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error?.message || "Failed to fetch links")
        }

        const data: ListLinksResponse = await response.json()

        // Convert API links to frontend format
        const frontendLinks = data.links.map(apiLinkToFrontendLink)

        setLinks(frontendLinks)
        setStats(data.stats)
        setTotalPages(data.pagination.totalPages)
        setTotalItems(data.pagination.totalItems)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao carregar links"
        setError(message)
        console.error("Error fetching links:", err)
      } finally {
        setIsLoading(false)
        setIsRefetching(false)
      }
    },
    [search, status, sortBy]
  )

  // Fetch links on mount and when filters change
  React.useEffect(() => {
    setCurrentPage(1)
    fetchLinks(1)
  }, [search, status, sortBy, fetchLinks])

  // Fetch links when page changes
  React.useEffect(() => {
    if (currentPage > 1 || !isLoading) {
      fetchLinks(currentPage, true)
    }
  }, [currentPage])

  // Transform for display
  const displayLinks = React.useMemo<DisplayLink[]>(() => {
    return links.map((link) => ({
      ...link,
      createdAt: formatRelativeDate(link.createdAt),
    }))
  }, [links])

  /**
   * Create a new link
   */
  const createLink = async (data: LinkFormData): Promise<void> => {
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Failed to create link")
      }

      toast.success("Link criado com sucesso!")

      // Refetch to get updated list
      await fetchLinks(1, true)
      setCurrentPage(1)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar link"
      toast.error(message)
      throw err
    }
  }

  /**
   * Update a link locally (for optimistic updates)
   */
  const updateLink = (id: string, data: Partial<Link>) => {
    setLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, ...data } : link))
    )
  }

  /**
   * Delete a link
   */
  const deleteLink = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Failed to delete link")
      }

      // Remove from local state immediately
      setLinks((prev) => prev.filter((link) => link.id !== id))
      toast.success("Link excluído com sucesso")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir link"
      toast.error(message)
      throw err
    }
  }

  /**
   * Toggle link active status
   */
  const toggleActive = async (id: string): Promise<void> => {
    const link = links.find((l) => l.id === id)
    if (!link) return

    const newStatus = !link.active

    // Optimistic update
    updateLink(id, { active: newStatus })

    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      })

      if (!response.ok) {
        // Revert on error
        updateLink(id, { active: link.active })
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Failed to update link")
      }

      toast.success(`Link ${newStatus ? "ativado" : "desativado"}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar link"
      toast.error(message)
    }
  }

  /**
   * Duplicate a link
   */
  const duplicateLink = async (id: string): Promise<void> => {
    const link = links.find((l) => l.id === id)
    if (!link) return

    try {
      // First, get the full link data
      const getResponse = await fetch(`/api/links/${id}`)
      if (!getResponse.ok) {
        throw new Error("Failed to fetch link data")
      }

      const { link: fullLink } = await getResponse.json()

      // Create new link with modified slug
      const newSlug = `${fullLink.slug}-copia`

      const createResponse = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: newSlug,
          phone: fullLink.destination,
          message: fullLink.message,
          ghostMode: fullLink.ghostMode,
          pixelId: fullLink.pixelId,
          capiToken: fullLink.capiToken,
          utmSource: fullLink.utmSource,
          utmMedium: fullLink.utmMedium,
          utmCampaign: fullLink.utmCampaign,
          utmContent: fullLink.utmContent,
          interstitial: fullLink.interstitial,
        }),
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json()
        throw new Error(errorData.error?.message || "Failed to duplicate link")
      }

      toast.success("Link duplicado com sucesso")

      // Refetch to get updated list
      await fetchLinks(1, true)
      setCurrentPage(1)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao duplicar link"
      toast.error(message)
    }
  }

  /**
   * Bulk delete links
   */
  const bulkDelete = async (ids: string[]): Promise<void> => {
    try {
      const response = await fetch("/api/links/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", ids }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Failed to delete links")
      }

      const data: BulkOperationResponse = await response.json()

      // Remove from local state
      setLinks((prev) => prev.filter((link) => !ids.includes(link.id)))

      toast.success(`${data.affectedCount} links excluídos`)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir links"
      toast.error(message)
    }
  }

  /**
   * Bulk enable links
   */
  const bulkEnable = async (ids: string[]): Promise<void> => {
    try {
      const response = await fetch("/api/links/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enable", ids }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Failed to enable links")
      }

      const data: BulkOperationResponse = await response.json()

      // Update local state
      setLinks((prev) =>
        prev.map((link) =>
          ids.includes(link.id) ? { ...link, active: true } : link
        )
      )

      toast.success(`${data.affectedCount} links ativados`)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao ativar links"
      toast.error(message)
    }
  }

  /**
   * Bulk disable links
   */
  const bulkDisable = async (ids: string[]): Promise<void> => {
    try {
      const response = await fetch("/api/links/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disable", ids }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Failed to disable links")
      }

      const data: BulkOperationResponse = await response.json()

      // Update local state
      setLinks((prev) =>
        prev.map((link) =>
          ids.includes(link.id) ? { ...link, active: false } : link
        )
      )

      toast.success(`${data.affectedCount} links desativados`)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao desativar links"
      toast.error(message)
    }
  }

  /**
   * Preview a link - opens in new tab
   */
  const previewLink = (slug: string, ghostMode: boolean) => {
    if (ghostMode) {
      // Open interstitial page preview
      window.open(`/interstitial/${slug}`, "_blank")
    } else {
      // Open redirect handler (which will go to WhatsApp)
      window.open(`/l/${slug}`, "_blank")
    }
  }

  /**
   * Refetch links
   */
  const refetch = async () => {
    await fetchLinks(currentPage, true)
  }

  return {
    links,
    displayLinks,
    stats,
    isLoading,
    isRefetching,
    error,
    currentPage,
    totalPages,
    totalItems,
    setCurrentPage,
    createLink,
    updateLink,
    deleteLink,
    toggleActive,
    duplicateLink,
    bulkDelete,
    bulkEnable,
    bulkDisable,
    previewLink,
    refetch,
  }
}

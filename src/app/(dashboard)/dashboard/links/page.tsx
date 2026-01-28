"use client"

import * as React from "react"
import { LinksHeader } from "@/components/dashboard/links/links-header"
import { LinksStats } from "@/components/dashboard/links/links-stats"
import { LinksTable } from "@/components/dashboard/links/links-table"
import { LinksBulkActions } from "@/components/dashboard/links/links-bulk-actions"
import { CreateLinkModal } from "@/components/dashboard/links/create-link-modal"
import { useDebounce } from "@/hooks/use-debounce"
import { mockLinks, type Link } from "@/lib/mock/links"
import { toast } from "sonner"

const ITEMS_PER_PAGE = 10

// Transform dates to strings for display
function formatCreatedAt(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return "today"
  if (days === 1) return "yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 14) return "1 week ago"
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 60) return "1 month ago"
  return `${Math.floor(days / 30)} months ago`
}

export default function LinksPage() {
  const [links, setLinks] = React.useState(mockLinks)
  const [modalOpen, setModalOpen] = React.useState(false)

  // Search and filter state
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [sortBy, setSortBy] = React.useState("newest")
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)

  // Selection state
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  // Loading state (simulate initial load)
  const [isLoading, setIsLoading] = React.useState(true)

  // Simulate initial data fetch
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

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

  // Paginated links
  const paginatedLinks = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredLinks.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredLinks, currentPage])

  // Transform links for table display
  const displayLinks = React.useMemo(() => {
    return paginatedLinks.map((link) => ({
      ...link,
      createdAt: formatCreatedAt(link.createdAt),
    }))
  }, [paginatedLinks])

  // Calculate stats
  const stats = React.useMemo(() => {
    const totalLinks = links.length
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
    const activeLinks = links.filter((link) => link.active).length
    const avgClickRate = totalLinks > 0 ? (totalClicks / totalLinks) * 100 / totalClicks * 10 : 0

    return {
      totalLinks,
      totalClicks,
      activeLinks,
      avgClickRate: Math.min(avgClickRate, 100),
      clicksTrend: { value: 12, isPositive: true },
    }
  }, [links])

  // Calculate pagination
  const totalPages = Math.ceil(filteredLinks.length / ITEMS_PER_PAGE)

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
    setSelectedIds([])
  }, [debouncedSearch, statusFilter, sortBy])

  // Handlers
  const handleCreateNew = () => {
    setModalOpen(true)
  }

  const handleEdit = (id: string) => {
    console.log("Edit link:", id)
    toast.info("Edit functionality coming soon")
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this link?")) {
      setLinks(links.filter((link) => link.id !== id))
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
      toast.success("Link deleted successfully")
    }
  }

  const handleToggleActive = (id: string) => {
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, active: !link.active } : link
      )
    )
    const link = links.find((l) => l.id === id)
    if (link) {
      toast.success(`Link ${link.active ? "disabled" : "enabled"}`)
    }
  }

  const handleDuplicate = (id: string) => {
    const link = links.find((l) => l.id === id)
    if (link) {
      const newLink: Link = {
        ...link,
        id: String(Date.now()),
        slug: `${link.slug}-copy`,
        clicks: 0,
        trend: { value: 0, isPositive: true },
        createdAt: new Date(),
      }
      setLinks([newLink, ...links])
      toast.success("Link duplicated successfully")
    }
  }

  const handleViewAnalytics = (id: string) => {
    console.log("View analytics:", id)
    toast.info("Analytics view coming soon")
  }

  const handleCopySuccess = (slug: string) => {
    toast.success(`Link copied: zap.lk/${slug}`)
  }

  const handleExport = () => {
    // Export filtered links as CSV
    const headers = ["Slug", "Destination", "Clicks", "Status", "Created"]
    const rows = filteredLinks.map((link) => [
      link.slug,
      link.destination,
      link.clicks.toString(),
      link.active ? "Active" : "Inactive",
      link.createdAt.toISOString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "links-export.csv"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Links exported successfully")
  }

  const handleSubmit = async (data: any) => {
    console.log("Creating link:", data)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Add new link to the list
    const newLink: Link = {
      id: String(Date.now()),
      slug: data.slug,
      destination: data.phone,
      message: data.message,
      clicks: 0,
      trend: { value: 0, isPositive: true },
      active: true,
      ghostMode: data.ghostMode,
      pixelId: data.pixelId || undefined,
      createdAt: new Date(),
    }
    setLinks([newLink, ...links])
    toast.success("Link created successfully!")
  }

  // Bulk action handlers
  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} links?`)) {
      setLinks(links.filter((link) => !selectedIds.includes(link.id)))
      toast.success(`${selectedIds.length} links deleted`)
      setSelectedIds([])
    }
  }

  const handleBulkEnable = () => {
    setLinks(
      links.map((link) =>
        selectedIds.includes(link.id) ? { ...link, active: true } : link
      )
    )
    toast.success(`${selectedIds.length} links enabled`)
    setSelectedIds([])
  }

  const handleBulkDisable = () => {
    setLinks(
      links.map((link) =>
        selectedIds.includes(link.id) ? { ...link, active: false } : link
      )
    )
    toast.success(`${selectedIds.length} links disabled`)
    setSelectedIds([])
  }

  const handleBulkExport = () => {
    const selectedLinks = links.filter((link) => selectedIds.includes(link.id))
    const headers = ["Slug", "Destination", "Clicks", "Status", "Created"]
    const rows = selectedLinks.map((link) => [
      link.slug,
      link.destination,
      link.clicks.toString(),
      link.active ? "Active" : "Inactive",
      link.createdAt.toISOString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "selected-links-export.csv"
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`${selectedIds.length} links exported`)
    setSelectedIds([])
  }

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <LinksHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onCreateNew={handleCreateNew}
        onExport={handleExport}
        totalLinks={filteredLinks.length}
      />

      {/* Stats banner */}
      <LinksStats stats={stats} isLoading={isLoading} />

      {/* Links table */}
      <LinksTable
        links={displayLinks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        onDuplicate={handleDuplicate}
        onViewAnalytics={handleViewAnalytics}
        onCopySuccess={handleCopySuccess}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredLinks.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />

      {/* Bulk actions toolbar */}
      <LinksBulkActions
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onBulkDelete={handleBulkDelete}
        onBulkEnable={handleBulkEnable}
        onBulkDisable={handleBulkDisable}
        onBulkExport={handleBulkExport}
      />

      {/* Create link modal */}
      <CreateLinkModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

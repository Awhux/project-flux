"use client"

import * as React from "react"
import {
  LinksHeader,
  LinksStatsBanner,
  LinksTable,
  LinksBulkActions,
  CreateLinkModalV2,
  useLinks,
  exportLinksToCSV,
} from "@/features/links"
import type { StatusFilter, SortOption } from "@/features/links"
import { toast } from "sonner"
import { useDebounce } from "@/hooks/use-debounce"

/**
 * Página de gerenciamento de links
 * Permite criar, editar, excluir e gerenciar links de rastreamento
 */
export default function LinksPage() {
  const [modalOpen, setModalOpen] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  // Filter state
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [sortBy, setSortBy] = React.useState<SortOption>("newest")

  // Debounce search query for API calls
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Use links hook with API integration
  const {
    links,
    displayLinks,
    stats,
    isLoading,
    currentPage,
    totalPages,
    totalItems,
    setCurrentPage,
    createLink,
    deleteLink,
    toggleActive,
    duplicateLink,
    bulkDelete,
    bulkEnable,
    bulkDisable,
    previewLink,
  } = useLinks({
    search: debouncedSearch,
    status: statusFilter,
    sortBy,
  })

  // Reset selection when filters change
  React.useEffect(() => {
    setSelectedIds([])
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, sortBy, setCurrentPage])

  // Handlers
  const handleCreateNew = () => setModalOpen(true)

  const handleEdit = (id: string) => {
    toast.info("Funcionalidade de edição em breve")
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este link?")) {
      await deleteLink(id)
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    }
  }

  const handleViewAnalytics = (id: string) => {
    toast.info("Visualização de análises em breve")
  }

  const handlePreview = (slug: string, ghostMode: boolean) => {
    previewLink(slug, ghostMode)
  }

  const handleExport = () => {
    exportLinksToCSV(links)
    toast.success("Links exportados com sucesso")
  }

  // Bulk action handlers
  const handleBulkDelete = async () => {
    if (confirm(`Tem certeza que deseja excluir ${selectedIds.length} links?`)) {
      await bulkDelete(selectedIds)
      setSelectedIds([])
    }
  }

  const handleBulkEnable = async () => {
    await bulkEnable(selectedIds)
    setSelectedIds([])
  }

  const handleBulkDisable = async () => {
    await bulkDisable(selectedIds)
    setSelectedIds([])
  }

  const handleBulkExport = () => {
    const selectedLinks = links.filter((link) => selectedIds.includes(link.id))
    exportLinksToCSV(selectedLinks, "links-selecionados.csv")
    toast.success(`${selectedIds.length} links exportados`)
    setSelectedIds([])
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho com busca e filtros */}
      <LinksHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onCreateNew={handleCreateNew}
        onExport={handleExport}
        totalLinks={totalItems}
      />

      {/* Banner de estatísticas */}
      <LinksStatsBanner stats={stats} isLoading={isLoading} />

      {/* Tabela de links */}
      <LinksTable
        links={displayLinks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={toggleActive}
        onDuplicate={duplicateLink}
        onViewAnalytics={handleViewAnalytics}
        onPreview={handlePreview}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={10}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        onCreateNew={handleCreateNew}
      />

      {/* Barra de ações em lote */}
      <LinksBulkActions
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onBulkDelete={handleBulkDelete}
        onBulkEnable={handleBulkEnable}
        onBulkDisable={handleBulkDisable}
        onBulkExport={handleBulkExport}
      />

      {/* Modal de criação de link - V2 com layout horizontal */}
      <CreateLinkModalV2
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={createLink}
      />
    </div>
  )
}

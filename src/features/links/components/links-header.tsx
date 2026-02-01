"use client"

import * as React from "react"
import {
  SearchIcon,
  PlusIcon,
  DownloadIcon,
  XIcon,
  FilterIcon,
  SlidersHorizontalIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/features/shared"
import type { StatusFilter, SortOption } from "../types"
import { statusOptions, sortOptions } from "../config"

export interface LinksHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: StatusFilter
  onStatusFilterChange: (status: StatusFilter) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  onCreateNew: () => void
  onExport?: () => void
  totalLinks: number
}

/**
 * Cabeçalho da página de links com busca e filtros
 */
export function LinksHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  onCreateNew,
  onExport,
  totalLinks,
}: LinksHeaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleClearSearch = () => {
    onSearchChange("")
    inputRef.current?.focus()
  }

  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) + (sortBy !== "newest" ? 1 : 0)

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Page Title */}
      <PageHeader
        title="Links"
        description="Gerencie e acompanhe seus links de rastreamento"
        actions={
          <div className="flex items-center gap-2 sm:gap-3">
            {onExport && (
              <Button
                variant="outline"
                size="default"
                onClick={onExport}
                className="hidden sm:inline-flex"
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            )}
            <Button size="default" onClick={onCreateNew} className="flex-1 sm:flex-none">
              <PlusIcon className="mr-2 h-4 w-4" />
              <span className="sm:hidden">Novo</span>
              <span className="hidden sm:inline">Criar Link</span>
            </Button>
          </div>
        }
      />

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 lg:max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Buscar links..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-10 pr-10 text-sm"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Limpar busca</span>
            </button>
          )}
        </div>

        {/* Desktop Filters */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filtros:</span>
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(v) => onStatusFilterChange(v as StatusFilter)}
            items={statusOptions}
          >
            <SelectTrigger className="h-10 w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select
            value={sortBy}
            onValueChange={(v) => onSortChange(v as SortOption)}
            items={sortOptions}
          >
            <SelectTrigger className="h-10 w-[150px]">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Filters */}
        <div className="flex items-center gap-2 lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="default" className="relative flex-1">
                  <SlidersHorizontalIcon className="mr-2 h-4 w-4" />
                  Filtros
                  {activeFilterCount > 0 && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onStatusFilterChange(option.value as StatusFilter)}
                  className={cn(statusFilter === option.value && "bg-muted")}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              {sortOptions.slice(0, 4).map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value as SortOption)}
                  className={cn(sortBy === option.value && "bg-muted")}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {onExport && (
            <Button variant="outline" size="icon" onClick={onExport}>
              <DownloadIcon className="h-4 w-4" />
              <span className="sr-only">Exportar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Encontrado{totalLinks !== 1 ? "s" : ""}{" "}
          <span className="font-medium text-foreground">
            {totalLinks}
          </span>{" "}
          link{totalLinks !== 1 ? "s" : ""} para "{searchQuery}"
        </p>
      )}
    </div>
  )
}

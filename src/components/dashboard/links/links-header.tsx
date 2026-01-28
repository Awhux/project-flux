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

interface LinksHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  onCreateNew: () => void
  onExport?: () => void
  totalLinks: number
}

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
  const [showMobileFilters, setShowMobileFilters] = React.useState(false)

  const handleClearSearch = () => {
    onSearchChange("")
    inputRef.current?.focus()
  }

  // Get active filter count for mobile indicator
  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) + (sortBy !== "newest" ? 1 : 0)

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Page Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-gray-100">
            Links
          </h1>
          <p className="mt-0.5 text-sm text-gray-500 sm:mt-1 dark:text-gray-400">
            Manage and track your short links
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {onExport && (
            <Button
              variant="outline"
              size="default"
              onClick={onExport}
              className="hidden sm:inline-flex"
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
          <Button size="default" onClick={onCreateNew} className="flex-1 sm:flex-none">
            <PlusIcon className="mr-2 h-4 w-4" />
            <span className="sm:hidden">New</span>
            <span className="hidden sm:inline">Create Link</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 lg:max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-10 pr-10 text-sm"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>

        {/* Desktop Filters */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Filters:</span>
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-10 w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="h-10 w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most-clicks">Most Clicks</SelectItem>
              <SelectItem value="least-clicks">Least Clicks</SelectItem>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Filters */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="default" className="relative flex-1">
                  <SlidersHorizontalIcon className="mr-2 h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-medium text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onStatusFilterChange("all")}
                className={cn(statusFilter === "all" && "bg-gray-100 dark:bg-gray-800")}
              >
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusFilterChange("active")}
                className={cn(statusFilter === "active" && "bg-gray-100 dark:bg-gray-800")}
              >
                Active
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusFilterChange("inactive")}
                className={cn(statusFilter === "inactive" && "bg-gray-100 dark:bg-gray-800")}
              >
                Inactive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onSortChange("newest")}
                className={cn(sortBy === "newest" && "bg-gray-100 dark:bg-gray-800")}
              >
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSortChange("oldest")}
                className={cn(sortBy === "oldest" && "bg-gray-100 dark:bg-gray-800")}
              >
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSortChange("most-clicks")}
                className={cn(sortBy === "most-clicks" && "bg-gray-100 dark:bg-gray-800")}
              >
                Most Clicks
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSortChange("least-clicks")}
                className={cn(sortBy === "least-clicks" && "bg-gray-100 dark:bg-gray-800")}
              >
                Least Clicks
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Export Button */}
          {onExport && (
            <Button variant="outline" size="icon" onClick={onExport}>
              <DownloadIcon className="h-4 w-4" />
              <span className="sr-only">Export</span>
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="text-sm text-gray-500">
          Found{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {totalLinks}
          </span>{" "}
          link{totalLinks !== 1 ? "s" : ""} matching "{searchQuery}"
        </p>
      )}
    </div>
  )
}

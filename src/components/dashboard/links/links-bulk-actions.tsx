"use client"

import * as React from "react"
import { XIcon, Trash2Icon, ToggleRightIcon, DownloadIcon, MoreHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface LinksBulkActionsProps {
  selectedCount: number
  onClear: () => void
  onBulkDelete: () => void
  onBulkEnable: () => void
  onBulkDisable: () => void
  onBulkExport?: () => void
  className?: string
}

export function LinksBulkActions({
  selectedCount,
  onClear,
  onBulkDelete,
  onBulkEnable,
  onBulkDisable,
  onBulkExport,
  className,
}: LinksBulkActionsProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-lg sm:bottom-6 sm:gap-3 sm:px-4 sm:py-3 dark:border-gray-700 dark:bg-gray-900",
        className
      )}
    >
      {/* Selection info */}
      <div className="flex items-center gap-2 border-r border-gray-200 pr-2 sm:pr-3 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {selectedCount}
          <span className="hidden sm:inline"> selected</span>
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onClear}
          className="text-gray-400 hover:text-gray-600"
        >
          <XIcon className="h-3.5 w-3.5" />
          <span className="sr-only">Clear selection</span>
        </Button>
      </div>

      {/* Desktop Actions */}
      <div className="hidden items-center gap-2 sm:flex">
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkEnable}
          className="gap-1.5"
        >
          <ToggleRightIcon className="h-4 w-4" />
          Enable
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDisable}
          className="gap-1.5"
        >
          <ToggleRightIcon className="h-4 w-4 rotate-180" />
          Disable
        </Button>
        {onBulkExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkExport}
            className="gap-1.5"
          >
            <DownloadIcon className="h-4 w-4" />
            Export
          </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          className="gap-1.5"
        >
          <Trash2Icon className="h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Mobile Actions Dropdown */}
      <div className="flex items-center gap-2 sm:hidden">
        <Button variant="destructive" size="sm" onClick={onBulkDelete}>
          <Trash2Icon className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            <MoreHorizontalIcon className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onBulkEnable}>
              <ToggleRightIcon className="mr-2 h-4 w-4" />
              Enable All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBulkDisable}>
              <ToggleRightIcon className="mr-2 h-4 w-4 rotate-180" />
              Disable All
            </DropdownMenuItem>
            {onBulkExport && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onBulkExport}>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Export
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

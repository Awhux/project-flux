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

export interface LinksBulkActionsProps {
  selectedCount: number
  onClear: () => void
  onBulkDelete: () => void
  onBulkEnable: () => void
  onBulkDisable: () => void
  onBulkExport?: () => void
  className?: string
}

/**
 * Barra de ações em lote para links selecionados
 */
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
        "fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 shadow-lg sm:bottom-6 sm:gap-3 sm:px-4 sm:py-3",
        className
      )}
    >
      {/* Selection info */}
      <div className="flex items-center gap-2 border-r border-border pr-2 sm:pr-3">
        <span className="text-sm font-medium">
          {selectedCount}
          <span className="hidden sm:inline"> selecionado{selectedCount !== 1 ? "s" : ""}</span>
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground"
        >
          <XIcon className="h-3.5 w-3.5" />
          <span className="sr-only">Limpar seleção</span>
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
          Ativar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDisable}
          className="gap-1.5"
        >
          <ToggleRightIcon className="h-4 w-4 rotate-180" />
          Desativar
        </Button>
        {onBulkExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkExport}
            className="gap-1.5"
          >
            <DownloadIcon className="h-4 w-4" />
            Exportar
          </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          className="gap-1.5"
        >
          <Trash2Icon className="h-4 w-4" />
          Excluir
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
              Ativar Todos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBulkDisable}>
              <ToggleRightIcon className="mr-2 h-4 w-4 rotate-180" />
              Desativar Todos
            </DropdownMenuItem>
            {onBulkExport && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onBulkExport}>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Exportar
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

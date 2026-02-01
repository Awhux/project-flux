"use client"

import * as React from "react"
import {
  CopyIcon,
  CheckIcon,
  EditIcon,
  Trash2Icon,
  MoreVerticalIcon,
  LinkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  BarChart3Icon,
  CopyPlusIcon,
  GhostIcon,
  ExternalLinkIcon,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/features/shared"
import { LinksPagination } from "./links-pagination"
import { cn } from "@/lib/utils"
import { formatNumber } from "@/features/shared/utils"
import { toast } from "sonner"
import type { DisplayLink } from "../types"

export interface LinksTableProps {
  links: DisplayLink[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
  onDuplicate?: (id: string) => void
  onViewAnalytics?: (id: string) => void
  onPreview?: (slug: string, ghostMode: boolean) => void
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  onCreateNew?: () => void
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i} className="animate-pulse">
          <TableCell className="px-6 py-4">
            <div className="h-4 w-4 rounded bg-muted" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            </div>
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="h-4 w-36 rounded bg-muted" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 rounded bg-muted" />
              <div className="h-5 w-12 rounded-full bg-muted" />
            </div>
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="h-6 w-11 rounded-full bg-muted" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="flex justify-end gap-2">
              <div className="h-8 w-8 rounded bg-muted" />
              <div className="h-8 w-8 rounded bg-muted" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

function TrendBadge({ value, isPositive }: { value: number; isPositive: boolean }) {
  if (value === 0) {
    return (
      <Badge variant="outline" className="gap-1 bg-muted text-muted-foreground">
        <MinusIcon className="h-3 w-3" />
        0%
      </Badge>
    )
  }

  return (
    <Badge
      variant={isPositive ? "default" : "destructive"}
      className={cn(
        "gap-1",
        isPositive &&
        "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
      )}
    >
      {isPositive ? (
        <ArrowUpIcon className="h-3 w-3" />
      ) : (
        <ArrowDownIcon className="h-3 w-3" />
      )}
      {value}%
    </Badge>
  )
}

/**
 * Tabela de links com seleção, paginação e ações
 */
export function LinksTable({
  links,
  onEdit,
  onDelete,
  onToggleActive,
  onDuplicate,
  onViewAnalytics,
  onPreview,
  selectedIds,
  onSelectionChange,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading,
  onCreateNew,
}: LinksTableProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const handleCopy = async (slug: string, id: string) => {
    await navigator.clipboard.writeText(`https://zap.lk/${slug}`)
    setCopiedId(id)
    toast.success(`Link copiado: zap.lk/${slug}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(links.map((link) => link.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id])
    } else {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id))
    }
  }

  const allSelected = links.length > 0 && selectedIds.length === links.length
  const someSelected = selectedIds.length > 0 && selectedIds.length < links.length

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-12 px-6 py-3">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Selecionar todos"
                  />
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Link
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Destino
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Cliques
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={5} />
              ) : links.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <EmptyState
                      icon={LinkIcon}
                      title="Nenhum link encontrado"
                      description="Crie seu primeiro link de rastreamento para começar a capturar leads e acompanhar conversões do WhatsApp."
                      actionLabel="Criar Primeiro Link"
                      onAction={onCreateNew}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                links.map((link) => (
                  <TableRow
                    key={link.id}
                    className={cn(
                      "h-16 border-b transition-colors hover:bg-muted/50",
                      selectedIds.includes(link.id) && "bg-primary/5"
                    )}
                  >
                    {/* Checkbox */}
                    <TableCell className="px-6 py-4">
                      <Checkbox
                        checked={selectedIds.includes(link.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(link.id, checked as boolean)
                        }
                        aria-label={`Selecionar ${link.slug}`}
                      />
                    </TableCell>

                    {/* Link Column */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          {link.ghostMode ? (
                            <GhostIcon className="h-5 w-5 text-primary" />
                          ) : (
                            <LinkIcon className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              zap.lk/{link.slug}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleCopy(link.slug, link.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {copiedId === link.id ? (
                                <CheckIcon className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <CopyIcon className="h-3.5 w-3.5" />
                              )}
                              <span className="sr-only">Copiar link</span>
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Criado {link.createdAt}</span>
                            {link.ghostMode && (
                              <Badge variant="outline" className="h-4 px-1.5 text-[10px] font-medium">
                                Ghost
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Destination Column */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇧🇷</span>
                        <span className="text-sm text-muted-foreground">
                          {link.destination}
                        </span>
                      </div>
                    </TableCell>

                    {/* Clicks Column */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold">
                          {formatNumber(link.clicks)}
                        </span>
                        <TrendBadge
                          value={link.trend.value}
                          isPositive={link.trend.isPositive}
                        />
                      </div>
                    </TableCell>

                    {/* Status Column */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={link.active}
                          onCheckedChange={() => onToggleActive(link.id)}
                          aria-label={`${link.active ? "Desativar" : "Ativar"} ${link.slug}`}
                        />
                        <span
                          className={cn(
                            "text-xs font-medium",
                            link.active
                              ? "text-green-600 dark:text-green-400"
                              : "text-muted-foreground"
                          )}
                        >
                          {link.active ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onEdit(link.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <EditIcon className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        {onViewAnalytics && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onViewAnalytics(link.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <BarChart3Icon className="h-4 w-4" />
                            <span className="sr-only">Ver análises</span>
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-muted-foreground hover:text-foreground"
                              />
                            }
                          >
                            <MoreVerticalIcon className="h-4 w-4" />
                            <span className="sr-only">Mais opções</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => onEdit(link.id)}>
                              <EditIcon className="mr-2 h-4 w-4" />
                              Editar Link
                            </DropdownMenuItem>
                            {onDuplicate && (
                              <DropdownMenuItem onClick={() => onDuplicate(link.id)}>
                                <CopyPlusIcon className="mr-2 h-4 w-4" />
                                Duplicar
                              </DropdownMenuItem>
                            )}
                            {onViewAnalytics && (
                              <DropdownMenuItem onClick={() => onViewAnalytics(link.id)}>
                                <BarChart3Icon className="mr-2 h-4 w-4" />
                                Ver Análises
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleCopy(link.slug, link.id)}>
                              <CopyIcon className="mr-2 h-4 w-4" />
                              Copiar Link
                            </DropdownMenuItem>
                            {onPreview && (
                              <DropdownMenuItem onClick={() => onPreview(link.slug, link.ghostMode)}>
                                <ExternalLinkIcon className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                              onClick={() => onDelete(link.id)}
                            >
                              <Trash2Icon className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && links.length > 0 && (
          <LinksPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
          />
        )}
      </CardContent>
    </Card>
  )
}

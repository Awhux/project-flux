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
  ShareIcon,
  GhostIcon,
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
import { LinksPagination } from "./links-pagination"
import { cn } from "@/lib/utils"

interface Link {
  id: string
  slug: string
  destination: string
  clicks: number
  trend: { value: number; isPositive: boolean }
  active: boolean
  createdAt: string
  ghostMode?: boolean
}

interface LinksTableProps {
  links: Link[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
  onDuplicate?: (id: string) => void
  onViewAnalytics?: (id: string) => void
  onCopySuccess?: (slug: string) => void
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i} className="animate-pulse">
          <TableCell className="px-6 py-4">
            <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-800" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="h-4 w-36 rounded bg-gray-200 dark:bg-gray-800" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-5 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="h-6 w-11 rounded-full bg-gray-200 dark:bg-gray-800" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="flex justify-end gap-2">
              <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

function EmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <LinkIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        No links found
      </h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        Create your first tracking link to start capturing leads and tracking
        WhatsApp conversions.
      </p>
      <Button size="lg" onClick={onCreateNew}>
        Create Your First Link
      </Button>
    </div>
  )
}

function TrendBadge({ value, isPositive }: { value: number; isPositive: boolean }) {
  if (value === 0) {
    return (
      <Badge
        variant="outline"
        className="gap-1 bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
      >
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

export function LinksTable({
  links,
  onEdit,
  onDelete,
  onToggleActive,
  onDuplicate,
  onViewAnalytics,
  onCopySuccess,
  selectedIds,
  onSelectionChange,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading,
}: LinksTableProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const handleCopy = async (slug: string, id: string) => {
    await navigator.clipboard.writeText(`https://zap.lk/${slug}`)
    setCopiedId(id)
    onCopySuccess?.(slug)
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
    <Card className="overflow-hidden border-gray-200 shadow-sm dark:border-gray-800">
      <CardContent className="p-0">
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50/50 hover:bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50">
                <TableHead className="w-12 px-6 py-3">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Link
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Destination
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Clicks
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Status
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={5} />
              ) : links.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <EmptyState onCreateNew={() => { }} />
                  </TableCell>
                </TableRow>
              ) : (
                links.map((link) => (
                  <TableRow
                    key={link.id}
                    className={cn(
                      "h-16 border-b border-gray-100 transition-colors hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-900/30",
                      selectedIds.includes(link.id) &&
                      "bg-indigo-50/50 dark:bg-indigo-900/10"
                    )}
                  >
                    {/* Checkbox */}
                    <TableCell className="px-6 py-4">
                      <Checkbox
                        checked={selectedIds.includes(link.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(link.id, checked as boolean)
                        }
                        aria-label={`Select ${link.slug}`}
                      />
                    </TableCell>

                    {/* Link Column */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                          {link.ghostMode ? (
                            <GhostIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <LinkIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              zap.lk/{link.slug}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleCopy(link.slug, link.id)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {copiedId === link.id ? (
                                <CheckIcon className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <CopyIcon className="h-3.5 w-3.5" />
                              )}
                              <span className="sr-only">Copy link</span>
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>Created {link.createdAt}</span>
                            {link.ghostMode && (
                              <Badge
                                variant="outline"
                                className="h-4 px-1.5 text-[10px] font-medium"
                              >
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
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {link.destination}
                        </span>
                      </div>
                    </TableCell>

                    {/* Clicks Column */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          {link.clicks.toLocaleString()}
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
                          aria-label={`Toggle ${link.slug} ${link.active ? "off" : "on"}`}
                        />
                        <span
                          className={cn(
                            "text-xs font-medium",
                            link.active
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-400 dark:text-gray-500"
                          )}
                        >
                          {link.active ? "Active" : "Inactive"}
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
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <EditIcon className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        {onViewAnalytics && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onViewAnalytics(link.id)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <BarChart3Icon className="h-4 w-4" />
                            <span className="sr-only">View Analytics</span>
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              />
                            }
                          >
                            <MoreVerticalIcon className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => onEdit(link.id)}>
                              <EditIcon className="mr-2 h-4 w-4" />
                              Edit Link
                            </DropdownMenuItem>
                            {onDuplicate && (
                              <DropdownMenuItem
                                onClick={() => onDuplicate(link.id)}
                              >
                                <CopyPlusIcon className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                            )}
                            {onViewAnalytics && (
                              <DropdownMenuItem
                                onClick={() => onViewAnalytics(link.id)}
                              >
                                <BarChart3Icon className="mr-2 h-4 w-4" />
                                View Analytics
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleCopy(link.slug, link.id)}
                            >
                              <CopyIcon className="mr-2 h-4 w-4" />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-900/30"
                              onClick={() => onDelete(link.id)}
                            >
                              <Trash2Icon className="mr-2 h-4 w-4" />
                              Delete
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

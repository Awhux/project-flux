"use client"

import * as React from "react"
import { EyeIcon, UsersIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/features/shared"
import { cn } from "@/lib/utils"
import { getInitials, getAvatarColor } from "../utils"
import type { DisplayLead } from "../types"

export interface LeadsTableProps {
  leads: DisplayLead[]
  isLoading?: boolean
  onViewDetails?: (id: string) => void
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i} className="animate-pulse">
          <TableCell className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-3 w-32 rounded bg-muted" />
              </div>
            </div>
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="h-4 w-32 rounded bg-muted" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="h-4 w-24 rounded bg-muted" />
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-muted" />
              <div className="h-3 w-16 rounded bg-muted" />
            </div>
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="h-8 w-8 rounded bg-muted" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

/**
 * Tabela de leads capturados
 */
export function LeadsTable({
  leads,
  isLoading,
  onViewDetails,
}: LeadsTableProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Lead
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Telefone
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Link
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Capturado em
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={5} />
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-0">
                    <EmptyState
                      icon={UsersIcon}
                      title="Nenhum lead capturado ainda"
                      description="Ative o Modo Ghost nos seus links para começar a capturar informações de leads antes do redirecionamento para o WhatsApp."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className="h-16 border-b transition-colors hover:bg-muted/50"
                  >
                    {/* Lead Column */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className={cn(getAvatarColor(lead.name))}>
                            {getInitials(lead.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{lead.name}</div>
                          {lead.email && (
                            <div className="text-xs text-muted-foreground">
                              {lead.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Phone Column */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇧🇷</span>
                        <span className="text-sm text-muted-foreground">
                          {lead.phone}
                        </span>
                      </div>
                    </TableCell>

                    {/* Link Column */}
                    <TableCell className="px-6 py-4">
                      <a
                        href="/links"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        zap.lk/{lead.linkSlug}
                      </a>
                    </TableCell>

                    {/* Captured Date Column */}
                    <TableCell className="px-6 py-4">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {lead.capturedAt}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {lead.capturedTime}
                        </div>
                      </div>
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onViewDetails?.(lead.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">Ver detalhes</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

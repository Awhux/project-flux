"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        default: "py-12 px-6",
        compact: "py-8 px-4",
        large: "py-16 px-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {
  /** Ícone a ser exibido */
  icon?: LucideIcon
  /** Título do estado vazio */
  title: string
  /** Descrição opcional */
  description?: string
  /** Texto do botão de ação */
  actionLabel?: string
  /** Callback do botão de ação */
  onAction?: () => void
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Componente de estado vazio reutilizável
 * Usado quando não há dados para exibir
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  size,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(emptyStateVariants({ size }), className)}>
      {/* Ícone */}
      {Icon && (
        <div className="mb-4 rounded-full bg-muted p-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}

      {/* Título */}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>

      {/* Descrição */}
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}

      {/* Botão de Ação */}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export { emptyStateVariants }

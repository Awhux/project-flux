"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const pageHeaderVariants = cva(
  "space-y-1",
  {
    variants: {
      size: {
        default: "",
        compact: "",
        large: "",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const pageTitleVariants = cva(
  "font-medium tracking-tight",
  {
    variants: {
      size: {
        default: "text-2xl sm:text-3xl",
        compact: "text-xl sm:text-2xl",
        large: "text-3xl sm:text-4xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface PageHeaderProps extends VariantProps<typeof pageHeaderVariants> {
  /** Título da página */
  title: string
  /** Descrição da página */
  description?: string
  /** Ações no lado direito do header */
  actions?: React.ReactNode
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Componente de cabeçalho de página reutilizável
 * Inclui título, descrição e área de ações
 */
export function PageHeader({
  title,
  description,
  actions,
  size,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className={cn(pageHeaderVariants({ size }))}>
        <h1 className={cn(pageTitleVariants({ size }))}>{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  )
}

export { pageHeaderVariants, pageTitleVariants }

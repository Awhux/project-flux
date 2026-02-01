"use client"

import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export interface NotificationToggleProps {
  /** ID único do toggle */
  id: string
  /** Título do toggle */
  title: string
  /** Descrição do toggle */
  description: string
  /** Se está ativo */
  checked: boolean
  /** Callback ao mudar */
  onCheckedChange: (checked: boolean) => void
  /** Se está desabilitado */
  disabled?: boolean
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Toggle de notificação com label e descrição
 */
export function NotificationToggle({
  id,
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: NotificationToggleProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div>
        <label htmlFor={id} className="font-medium cursor-pointer">
          {title}
        </label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  )
}

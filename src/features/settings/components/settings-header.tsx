"use client"

import * as React from "react"
import { PageHeader } from "@/features/shared"

export interface SettingsHeaderProps {
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Cabeçalho da página de configurações
 */
export function SettingsHeader({ className }: SettingsHeaderProps) {
  return (
    <PageHeader
      title="Configurações"
      description="Gerencie suas configurações de conta e preferências"
      className={className}
    />
  )
}

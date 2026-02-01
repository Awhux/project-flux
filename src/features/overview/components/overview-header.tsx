"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/features/shared"
import Link from "next/link"

export interface OverviewHeaderProps {
  /** Nome do usuário para saudação personalizada */
  userName?: string
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Cabeçalho da página de visão geral
 * Inclui saudação e ação rápida para criar link
 */
export function OverviewHeader({ userName, className }: OverviewHeaderProps) {
  return (
    <PageHeader
      title={userName ? `Olá, ${userName}!` : "Bem-vindo de volta!"}
      description="Aqui está um resumo do desempenho do seu ZapLink"
      className={className}
    />
  )
}

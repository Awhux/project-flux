"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tabOptions } from "../config/settings.config"
import type { SettingsTab } from "../types"

export interface SettingsTabsProps {
  /** Tab ativa */
  activeTab: SettingsTab
  /** Callback para mudança de tab */
  onTabChange: (tab: SettingsTab) => void
  /** Children (conteúdo das tabs) */
  children: React.ReactNode
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Container de tabs para as configurações
 */
export function SettingsTabs({
  activeTab,
  onTabChange,
  children,
  className,
}: SettingsTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as SettingsTab)}
      className={className}
    >
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
        {tabOptions.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  )
}

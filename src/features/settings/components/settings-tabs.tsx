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

// MVP: Only account tab is enabled for now
const ENABLED_TABS: SettingsTab[] = ["account"]

/**
 * Container de tabs para as configurações
 */
export function SettingsTabs({
  activeTab,
  onTabChange,
  children,
  className,
}: SettingsTabsProps) {
  const handleTabChange = (value: string) => {
    const tab = value as SettingsTab
    // Prevent navigation to disabled tabs
    if (ENABLED_TABS.includes(tab)) {
      onTabChange(tab)
    }
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className={className}
    >
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
        {tabOptions.map((tab) => {
          const isEnabled = ENABLED_TABS.includes(tab.value as SettingsTab)
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={!isEnabled}
              className={
                !isEnabled
                  ? "opacity-40 cursor-not-allowed hover:opacity-40 data-[state=active]:opacity-40"
                  : ""
              }
            >
              {tab.label}
            </TabsTrigger>
          )
        })}
      </TabsList>
      {children}
    </Tabs>
  )
}

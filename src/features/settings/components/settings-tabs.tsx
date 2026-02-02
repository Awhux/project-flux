"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
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

// All tabs are enabled
const ENABLED_TABS: SettingsTab[] = ["account", "plan", "api", "preferences"]

/**
 * Container de tabs para as configurações
 */
export function SettingsTabs({
  activeTab,
  onTabChange,
  children,
  className,
}: SettingsTabsProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleTabChange = (value: string) => {
    const tab = value as SettingsTab
    // Prevent navigation to disabled tabs
    if (ENABLED_TABS.includes(tab)) {
      onTabChange(tab)
      // Update URL with tab query parameter
      router.push(`${pathname}?tab=${tab}`, { scroll: false })
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

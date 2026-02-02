"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import {
  SettingsHeader,
  SettingsTabs,
  AccountTab,
  PlanTab,
  ApiTab,
  PreferencesTab,
  useSettings,
  availablePlans,
} from "@/features/settings"
import type { SettingsTab } from "@/features/settings"

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab") as SettingsTab | null
  const [activeTab, setActiveTab] = React.useState<SettingsTab>(tabParam || "account")
  const [isUpgrading, setIsUpgrading] = React.useState(false)

  const {
    settings,
    isLoading,
    updateProfile,
    updatePassword,
    updateNotifications,
    updateRegional,
    updateApiSettings,
    regenerateApiKey,
  } = useSettings()

  // Update active tab when URL changes
  React.useEffect(() => {
    if (tabParam && ["account", "plan", "api", "preferences"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handlePlanSelect = async (planId: string) => {
    setIsUpgrading(true)
    try {
      // Em produção, redirecionaria para o checkout
      console.log("Upgrading to plan:", planId)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert(`Redirecionando para checkout do plano ${planId}...`)
    } finally {
      setIsUpgrading(false)
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <SettingsHeader />

      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab}>
        <AccountTab
          profile={settings.profile}
          onProfileSave={updateProfile}
          onPasswordChange={updatePassword}
          isSavingProfile={isLoading}
          isUpdatingPassword={isLoading}
        />

        <PlanTab
          plans={availablePlans}
          billingHistory={[]}
          onPlanSelect={handlePlanSelect}
          isUpgrading={isUpgrading}
        />

        <ApiTab
          settings={settings.api}
          onSaveSettings={updateApiSettings}
          onRegenerateApiKey={regenerateApiKey}
          isSaving={isLoading}
        />

        <PreferencesTab
          notifications={settings.notifications}
          regional={settings.regional}
          onNotificationChange={updateNotifications}
          onRegionalSave={updateRegional}
          isSaving={isLoading}
        />
      </SettingsTabs>
    </div>
  )
}

"use client"

import * as React from "react"
import { TabsContent } from "@/components/ui/tabs"
import { ProfileForm } from "./profile-form"
import { SecurityForm } from "./security-form"
import type { UserProfile, PasswordChangeData } from "../types"

export interface AccountTabProps {
  /** Dados do perfil */
  profile: UserProfile
  /** Callback ao salvar perfil */
  onProfileSave: (profile: UserProfile) => void
  /** Callback ao alterar senha */
  onPasswordChange: (data: PasswordChangeData) => void
  /** Se está salvando perfil */
  isSavingProfile?: boolean
  /** Se está atualizando senha */
  isUpdatingPassword?: boolean
}

/**
 * Tab de conta com formulários de perfil e segurança
 */
export function AccountTab({
  profile,
  onProfileSave,
  onPasswordChange,
  isSavingProfile = false,
  isUpdatingPassword = false,
}: AccountTabProps) {
  return (
    <TabsContent value="account" className="space-y-4 mt-6">
      <ProfileForm
        profile={profile}
        onSave={onProfileSave}
        isSaving={isSavingProfile}
      />
      <SecurityForm
        onPasswordChange={onPasswordChange}
        isUpdating={isUpdatingPassword}
      />
    </TabsContent>
  )
}

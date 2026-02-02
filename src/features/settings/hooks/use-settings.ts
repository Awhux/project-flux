"use client"

import * as React from "react"
import { toast } from "sonner"
import { authClient } from "@/features/auth/client"
import { defaultSettings } from "../config/settings.config"
import type {
  SettingsState,
  UserProfile,
  NotificationSettings,
  RegionalSettings,
  ApiSettings,
  PasswordChangeData,
} from "../types"

interface UseSettingsReturn {
  /** Estado atual das configurações */
  settings: SettingsState
  /** Se está carregando */
  isLoading: boolean
  /** Atualiza o perfil */
  updateProfile: (profile: UserProfile) => Promise<void>
  /** Atualiza a senha */
  updatePassword: (data: PasswordChangeData) => Promise<void>
  /** Atualiza as notificações */
  updateNotifications: (key: keyof NotificationSettings, value: boolean) => void
  /** Atualiza as configurações regionais */
  updateRegional: (settings: RegionalSettings) => Promise<void>
  /** Atualiza as configurações de API */
  updateApiSettings: (settings: Partial<ApiSettings>) => Promise<void>
  /** Regenera a chave de API */
  regenerateApiKey: () => Promise<void>
}

/**
 * Hook para gerenciar o estado das configurações
 */
export function useSettings(): UseSettingsReturn {
  const { data: session } = authClient.useSession()
  const [settings, setSettings] = React.useState<SettingsState>(defaultSettings)
  const [isLoading, setIsLoading] = React.useState(false)

  // Atualiza o perfil quando a sessão mudar
  React.useEffect(() => {
    if (session?.user) {
      const user = session.user
      const profile: UserProfile = {
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: "", // Better Auth doesn't store phone by default
        avatarUrl: user.image || "",
      }
      setSettings((prev) => ({ ...prev, profile }))
    }
  }, [session])

  const updateProfile = async (profile: UserProfile) => {
    setIsLoading(true)
    try {
      // Update user profile using Better Auth
      const { error } = await authClient.updateUser({
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        image: profile.avatarUrl,
      })

      if (error) {
        toast.error("Erro ao atualizar perfil")
        throw error
      }

      setSettings((prev) => ({ ...prev, profile }))
      toast.success("Perfil atualizado com sucesso")
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePassword = async (data: PasswordChangeData) => {
    setIsLoading(true)
    try {
      const { error } = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: false,
      })

      if (error) {
        toast.error(error.message || "Erro ao alterar senha")
        throw error
      }

      toast.success("Senha alterada com sucesso")
    } catch (error) {
      console.error("Error updating password:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateNotifications = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
    // TODO: Persist notification settings to backend
  }

  const updateRegional = async (regional: RegionalSettings) => {
    setIsLoading(true)
    try {
      // TODO: Persist regional settings to backend
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSettings((prev) => ({ ...prev, regional }))
      toast.success("Configurações regionais atualizadas")
    } finally {
      setIsLoading(false)
    }
  }

  const updateApiSettings = async (apiSettings: Partial<ApiSettings>) => {
    setIsLoading(true)
    try {
      // TODO: Persist API settings to backend
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSettings((prev) => ({
        ...prev,
        api: { ...prev.api, ...apiSettings },
      }))
      toast.success("Configurações de API atualizadas")
    } finally {
      setIsLoading(false)
    }
  }

  const regenerateApiKey = async () => {
    setIsLoading(true)
    try {
      // TODO: Call backend to regenerate API key
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newKey = `zaplink_${Math.random().toString(36).substring(2, 18)}`
      setSettings((prev) => ({
        ...prev,
        api: { ...prev.api, apiKey: newKey },
      }))
      toast.success("Chave de API regenerada")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    settings,
    isLoading,
    updateProfile,
    updatePassword,
    updateNotifications,
    updateRegional,
    updateApiSettings,
    regenerateApiKey,
  }
}

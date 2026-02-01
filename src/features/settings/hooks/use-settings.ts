"use client"

import * as React from "react"
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
  const [settings, setSettings] = React.useState<SettingsState>(defaultSettings)
  const [isLoading, setIsLoading] = React.useState(false)

  // Simula chamada à API
  const simulateApiCall = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const updateProfile = async (profile: UserProfile) => {
    setIsLoading(true)
    try {
      await simulateApiCall()
      setSettings((prev) => ({ ...prev, profile }))
    } finally {
      setIsLoading(false)
    }
  }

  const updatePassword = async (data: PasswordChangeData) => {
    setIsLoading(true)
    try {
      await simulateApiCall()
      // Em produção, enviaria para a API
      console.log("Password updated:", data)
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
  }

  const updateRegional = async (regional: RegionalSettings) => {
    setIsLoading(true)
    try {
      await simulateApiCall()
      setSettings((prev) => ({ ...prev, regional }))
    } finally {
      setIsLoading(false)
    }
  }

  const updateApiSettings = async (apiSettings: Partial<ApiSettings>) => {
    setIsLoading(true)
    try {
      await simulateApiCall()
      setSettings((prev) => ({
        ...prev,
        api: { ...prev.api, ...apiSettings },
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const regenerateApiKey = async () => {
    setIsLoading(true)
    try {
      await simulateApiCall()
      // Simula geração de nova chave
      const newKey = `zaplink_${Math.random().toString(36).substring(2, 18)}`
      setSettings((prev) => ({
        ...prev,
        api: { ...prev.api, apiKey: newKey },
      }))
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

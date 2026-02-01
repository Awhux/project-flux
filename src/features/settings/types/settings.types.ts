/**
 * Settings feature types
 */

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  avatarUrl?: string
}

export interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
}

export interface RegionalSettings {
  language: string
  timezone: string
}

export interface ApiSettings {
  defaultPixelId: string
  defaultCapiToken: string
  apiKey: string
}

export interface PlanInfo {
  id: string
  name: string
  price: number
  features: string[]
  isCurrentPlan: boolean
  isHighlighted: boolean
}

export interface BillingHistoryItem {
  id: string
  date: string
  description: string
  amount: number
  status: "paid" | "pending" | "failed"
}

export interface SettingsState {
  profile: UserProfile
  notifications: NotificationSettings
  regional: RegionalSettings
  api: ApiSettings
}

export type SettingsTab = "account" | "plan" | "api" | "preferences"

export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

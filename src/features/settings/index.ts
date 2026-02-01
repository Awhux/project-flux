// Components
export {
  SettingsHeader,
  SettingsTabs,
  ProfileForm,
  SecurityForm,
  PlanCard,
  planCardVariants,
  NotificationToggle,
  AccountTab,
  PlanTab,
  ApiTab,
  PreferencesTab,
} from "./components"

export type {
  SettingsHeaderProps,
  SettingsTabsProps,
  ProfileFormProps,
  SecurityFormProps,
  PlanCardProps,
  NotificationToggleProps,
  AccountTabProps,
  PlanTabProps,
  ApiTabProps,
  PreferencesTabProps,
} from "./components"

// Hooks
export { useSettings, useSettingsForm } from "./hooks"

// Utils
export {
  validateProfile,
  validatePasswordChange,
  validateApiSettings,
  formatPhone,
} from "./utils"

// Types
export type {
  UserProfile,
  NotificationSettings,
  RegionalSettings,
  ApiSettings,
  PlanInfo,
  BillingHistoryItem,
  SettingsState,
  SettingsTab,
  PasswordChangeData,
} from "./types"

// Config
export {
  mockProfile,
  defaultNotifications,
  defaultRegional,
  defaultApiSettings,
  defaultSettings,
  availablePlans,
  tabOptions,
  languageOptions,
  timezoneOptions,
  notificationOptions,
} from "./config/settings.config"

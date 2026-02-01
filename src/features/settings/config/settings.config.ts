import type {
  UserProfile,
  NotificationSettings,
  RegionalSettings,
  ApiSettings,
  PlanInfo,
  SettingsState,
} from "../types"

/**
 * Mock profile data
 */
export const mockProfile: UserProfile = {
  firstName: "João",
  lastName: "Silva",
  email: "joao@example.com",
  phone: "+55 (11) 98765-4321",
}

/**
 * Default notification settings
 */
export const defaultNotifications: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
}

/**
 * Default regional settings
 */
export const defaultRegional: RegionalSettings = {
  language: "pt-br",
  timezone: "america-sao-paulo",
}

/**
 * Default API settings
 */
export const defaultApiSettings: ApiSettings = {
  defaultPixelId: "",
  defaultCapiToken: "",
  apiKey: "zaplink_••••••••••••••••",
}

/**
 * Default settings state
 */
export const defaultSettings: SettingsState = {
  profile: mockProfile,
  notifications: defaultNotifications,
  regional: defaultRegional,
  api: defaultApiSettings,
}

/**
 * Available plans
 */
export const availablePlans: PlanInfo[] = [
  {
    id: "free",
    name: "Plano Gratuito",
    price: 0,
    features: [
      "100 cliques/mês",
      "1 link ativo",
      "Análises básicas",
    ],
    isCurrentPlan: true,
    isHighlighted: false,
  },
  {
    id: "pro",
    name: "Plano Pro",
    price: 29,
    features: [
      "5.000 cliques/mês",
      "Links ilimitados",
      "Facebook CAPI",
      "Modo Fantasma",
    ],
    isCurrentPlan: false,
    isHighlighted: true,
  },
  {
    id: "agency",
    name: "Plano Agência",
    price: 99,
    features: [
      "Cliques ilimitados",
      "Links ilimitados",
      "Suporte prioritário",
      "White-label",
    ],
    isCurrentPlan: false,
    isHighlighted: false,
  },
]

/**
 * Tab configuration in Portuguese
 */
export const tabOptions = [
  { value: "account", label: "Conta" },
  { value: "plan", label: "Plano e Cobrança" },
  { value: "api", label: "API" },
  { value: "preferences", label: "Preferências" },
] as const

/**
 * Language options
 */
export const languageOptions = [
  { value: "pt-br", label: "Português (Brasil)" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
] as const

/**
 * Timezone options
 */
export const timezoneOptions = [
  { value: "america-sao-paulo", label: "(GMT-3) São Paulo" },
  { value: "america-new-york", label: "(GMT-5) New York" },
  { value: "europe-london", label: "(GMT+0) Londres" },
  { value: "asia-tokyo", label: "(GMT+9) Tóquio" },
] as const

/**
 * Notification options configuration
 */
export const notificationOptions = [
  {
    id: "email",
    title: "Notificações por E-mail",
    description: "Receba atualizações por e-mail",
  },
  {
    id: "sms",
    title: "Notificações por SMS",
    description: "Receba alertas por SMS",
  },
  {
    id: "push",
    title: "Notificações Push",
    description: "Receba notificações no navegador",
  },
] as const

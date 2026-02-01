import {
  LayoutDashboardIcon,
  LinkIcon,
  BarChart3Icon,
  UsersIcon,
  SettingsIcon,
} from "lucide-react"
import type { NavigationItem, NavigationUser, NavigationPlan } from "../types/navigation.types"

/**
 * Main navigation items configuration
 * Centralized to avoid prop drilling and ensure consistency
 */
export const navigationItems: NavigationItem[] = [
  {
    name: "Overview",
    href: "/",
    icon: LayoutDashboardIcon,
  },
  {
    name: "Links",
    href: "/links",
    icon: LinkIcon,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3Icon,
  },
  {
    name: "Leads",
    href: "/leads",
    icon: UsersIcon,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: SettingsIcon,
  },
]

/**
 * Brand configuration
 */
export const brandConfig = {
  name: "ZapLink",
  shortName: "ZL",
} as const

/**
 * Mock user data - replace with actual user data from auth
 */
export const mockUser: NavigationUser = {
  name: "João Silva",
  email: "joao@example.com",
  initials: "JS",
}

/**
 * Mock plan data - replace with actual subscription data
 */
export const mockPlan: NavigationPlan = {
  name: "FREE",
  isPaid: false,
}

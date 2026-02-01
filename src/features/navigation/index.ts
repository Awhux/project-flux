/**
 * Navigation Feature
 *
 * This module exports all navigation-related components, hooks, types, and configuration.
 * Use this as the main entry point for navigation functionality.
 */

// Components
export { NavigationBar } from "./components/navigation-bar"
export { NavigationTabs, navigationTabVariants } from "./components/navigation-tabs"
export { NavigationLogo, navigationLogoVariants, logoIconVariants, logoTextVariants } from "./components/navigation-logo"
export { NavigationActions } from "./components/navigation-actions"
export { UserMenu } from "./components/user-menu"
export { MobileNavigation, mobileNavItemVariants } from "./components/mobile-navigation"

// Hooks
export { useNavigation } from "./hooks/use-navigation"

// Config
export { navigationItems, brandConfig, mockUser, mockPlan } from "./config/navigation.config"

// Types
export type {
  NavigationItem,
  NavigationUser,
  NavigationPlan,
  NavigationState,
} from "./types/navigation.types"

"use client"

import type { LucideIcon } from "lucide-react"

/**
 * Navigation item configuration
 */
export interface NavigationItem {
  /** Display name for the navigation item */
  name: string
  /** URL path for the navigation item */
  href: string
  /** Lucide icon component */
  icon: LucideIcon
}

/**
 * User data for navigation display
 */
export interface NavigationUser {
  /** User's display name */
  name: string
  /** User's email address */
  email: string
  /** User's initials for avatar fallback */
  initials: string
  /** Optional avatar image URL */
  avatarUrl?: string
}

/**
 * Plan information for display in navigation
 */
export interface NavigationPlan {
  /** Plan name (e.g., "FREE", "PRO") */
  name: string
  /** Whether the plan is a paid plan */
  isPaid: boolean
}

/**
 * Navigation state managed by the hook
 */
export interface NavigationState {
  /** Current pathname from router */
  pathname: string
  /** Whether mobile menu is open */
  isMobileMenuOpen: boolean
  /** Toggle mobile menu state */
  toggleMobileMenu: () => void
  /** Open mobile menu */
  openMobileMenu: () => void
  /** Close mobile menu */
  closeMobileMenu: () => void
  /** Check if a navigation item is active */
  isActive: (href: string) => boolean
}

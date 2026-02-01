"use client"

import { cn } from "@/lib/utils"
import { NavigationLogo } from "./navigation-logo"
import { NavigationTabs } from "./navigation-tabs"
import { NavigationActions } from "./navigation-actions"
import { MobileNavigation } from "./mobile-navigation"

export interface NavigationBarProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * Main navigation bar component
 * Combines logo, navigation tabs, and actions
 * Responsive: shows horizontal nav on desktop, hamburger menu on mobile
 */
export function NavigationBar({ className }: NavigationBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border bg-background",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Left Section: Logo + Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Mobile hamburger menu - visible only on small screens */}
          <MobileNavigation className="lg:hidden" />

          {/* Logo */}
          <NavigationLogo />
        </div>

        {/* Center Section: Navigation Tabs - hidden on mobile */}
        <NavigationTabs className="hidden lg:flex" />

        {/* Right Section: Actions */}
        <NavigationActions />
      </div>
    </header>
  )
}

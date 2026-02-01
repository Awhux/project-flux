"use client"

import { useState, useCallback, useMemo } from "react"
import { usePathname } from "next/navigation"
import type { NavigationState } from "../types/navigation.types"

/**
 * Custom hook for navigation state management
 * Encapsulates all navigation logic to avoid prop drilling
 */
export function useNavigation(): NavigationState {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  const isActive = useCallback(
    (href: string): boolean => {
      // Exact match for root path
      if (href === "/") {
        return pathname === "/"
      }
      // For other paths, check if pathname starts with href
      return pathname === href || pathname.startsWith(`${href}/`)
    },
    [pathname]
  )

  return useMemo(
    () => ({
      pathname,
      isMobileMenuOpen,
      toggleMobileMenu,
      openMobileMenu,
      closeMobileMenu,
      isActive,
    }),
    [pathname, isMobileMenuOpen, toggleMobileMenu, openMobileMenu, closeMobileMenu, isActive]
  )
}

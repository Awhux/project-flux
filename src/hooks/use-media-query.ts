"use client"

import * as React from "react"

/**
 * Hook to detect media query matches
 * @example
 * const isMobile = useMediaQuery("(max-width: 768px)")
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    
    // Set initial value
    setMatches(media.matches)

    // Create event listener
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    // Add listener
    media.addEventListener("change", listener)

    // Cleanup
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}

/**
 * Predefined breakpoint hooks
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)")
}

export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 769px) and (max-width: 1024px)")
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1025px)")
}

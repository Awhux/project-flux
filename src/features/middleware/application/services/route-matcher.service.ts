import type { NextRequest } from 'next/server'
import { match } from 'path-to-regexp'

/**
 * Creates a route matcher function that checks if a request matches any of the provided patterns.
 *
 * This implementation uses path-to-regexp for pattern matching and supports both positive
 * and negative patterns for flexible route matching logic.
 *
 * @param patterns - Array of route patterns to match against. Supports:
 *   - Standard path patterns: '/path', '/path{/*rest}', '/path/:param'
 *   - Negation patterns: '!/path' (excludes matching paths from positive matches)
 *   - Glob patterns: '{/*path}' for catch-all matching
 * @returns A function that takes a NextRequest and returns true if the route matches
 *
 * Pattern matching logic:
 * 1. If any negative pattern matches, returns false (exclusion takes precedence)
 * 2. If no positive patterns exist, returns true (unless excluded)
 * 3. Returns true if any positive pattern matches
 *
 * @example
 * ```ts
 * // Match specific public routes
 * const isPublicRoute = createRouteMatcher(['/home', '/about', '/api/public{/*path}']);
 *
 * // Match all routes except authentication pages
 * const isProtectedRoute = createRouteMatcher(['/', '!/auth/sign-in{/*path}', '!/auth/sign-up{/*path}', '{/*path}']);
 *
 * // Usage in middleware
 * if (isPublicRoute(request)) {
 *   // Handle public route logic
 * }
 * ```
 */
export function createRouteMatcher(patterns: string[]) {
  const positivePatterns: string[] = []
  const negativePatterns: string[] = []

  for (const pattern of patterns) {
    if (pattern.startsWith('!')) {
      negativePatterns.push(pattern.slice(1))
    } else {
      positivePatterns.push(pattern)
    }
  }

  const positiveMatchers = positivePatterns.map((pattern) =>
    match(pattern, { decode: decodeURIComponent, sensitive: false }),
  )

  const negativeMatchers = negativePatterns.map((pattern) =>
    match(pattern, { decode: decodeURIComponent, sensitive: false }),
  )

  /**
   * Route matcher function that evaluates if a request matches the configured patterns.
   *
   * @param request - The incoming NextRequest to evaluate
   * @returns true if the request path matches the pattern rules, false otherwise
   */
  return function routeMatcher(request: NextRequest): boolean {
    const pathname = request.nextUrl.pathname

    const isExcluded = negativeMatchers.some((matcher) => {
      const result = matcher(pathname)
      return result !== false
    })

    if (isExcluded) {
      return false
    }

    if (positiveMatchers.length === 0) {
      return true
    }

    const isMatched = positiveMatchers.some((matcher) => {
      const result = matcher(pathname)
      return result !== false
    })

    return isMatched
  }
}


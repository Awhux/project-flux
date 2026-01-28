import type { NextRequest } from 'next/server'
import {
  guestRouteMatcher,
  publicRouteMatcher,
} from './route-matchers'

/**
 * Determines if authentication is required for the requested route.
 *
 * @param userId - The current user's ID or null if not authenticated
 * @param request - The incoming NextRequest object
 * @returns true if authentication is required, false otherwise
 */
export function isAuthenticationRequired(
  userId: string | null,
  request: NextRequest,
): boolean {
  if (publicRouteMatcher(request)) {
    return false
  }

  if (guestRouteMatcher(request)) {
    return false
  }

  if (userId) {
    return false
  }

  return true
}

/**
 * Checks if an authenticated user is trying to access a guest-only route.
 *
 * @param userId - The current user's ID or null if not authenticated
 * @param request - The incoming NextRequest object
 * @returns true if user is authenticated AND trying to access guest-only route
 */
export function isGuestOnlyRoute(
  userId: string | null,
  request: NextRequest,
): boolean {
  return !!userId && guestRouteMatcher(request)
}


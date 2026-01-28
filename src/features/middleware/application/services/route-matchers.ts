import { createRouteMatcher } from './route-matcher.service'

/**
 * Route matcher for public assets and files that should always be accessible
 * without authentication. Includes robots.txt, manifest, and favicon.
 */
export const publicRouteMatcher = createRouteMatcher([
  '/robots.txt',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/policies/{/*path}',
])

/**
 * Route matcher for authentication pages that are only accessible to guests
 * (non-authenticated users). Includes sign-in and sign-up pages with all sub-paths.
 */
export const guestRouteMatcher = createRouteMatcher([
  '/auth/sign-up{/*path}',
  '/auth/sign-in{/*path}',
])

/**
 * Route matcher for protected routes that require authentication.
 * Uses negative patterns to exclude authentication pages from the catch-all pattern.
 * Includes root path and all other routes except sign-in/sign-up.
 */
export const authenticatedRouteMatcher = createRouteMatcher([
  '/',
  '!/auth/sign-up{/*path}',
  '!/auth/sign-in{/*path}',
  '{/*path}',
])

/**
 * Route matcher for API endpoints and tRPC routes.
 * Covers all paths under /api and /trpc namespaces.
 */
export const apiRouteMatcher = createRouteMatcher([
  '/api{/*path}',
  '/trpc{/*path}',
])


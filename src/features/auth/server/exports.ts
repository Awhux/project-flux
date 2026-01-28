/**
 * Server-side better-auth exports
 * Re-exports commonly used better-auth server utilities
 */

// Core better-auth server functionality
export { betterAuth } from 'better-auth'

// Cookie utilities for server-side cookie management
export {
  deleteSessionCookie,
  getChunkedCookie,
  getCookieCache,
  getCookies,
  getSessionCookie,
} from 'better-auth/cookies'

// Node.js handler adapter
export { toNodeHandler } from 'better-auth/node'

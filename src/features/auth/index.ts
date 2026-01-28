/**
 * Auth Feature - Public API
 * 
 * This is the main entry point for the auth feature.
 * All exports are organized by concern following DDD principles.
 */

// ============================================================================
// Infrastructure Layer
// ============================================================================
export type { AuthEnvironment } from './infrastructure/environment'
export {
  isBrowser,
  getAuthEnv,
  parseCommaSeparated,
  validateServerEnv,
} from './infrastructure/environment'

// ============================================================================
// Constants
// ============================================================================
export {
  AUTH_COOKIE_PREFIX,
  AUTH_COOKIE_SESSION_NAME,
  AUTH_COOKIE_LAST_LOGIN_METHOD_NAME,
} from './constants'

// ============================================================================
// Types
// ============================================================================
export type { AuthConfigEnv, CookieConfig } from './config/types'
export type { CreateAuthClientOptions } from './client/types'
export type {
  Auth,
  BetterAuthOptions,
  ExtendedSession,
  Session,
  User,
} from './server/types'

// ============================================================================
// Configuration Layer
// ============================================================================
export {
  createAuthConfig,
  createCookieConfig,
  getDefaultAdvancedConfig,
  shouldUseLaxCookies,
  getTrustedOrigins,
} from './config'

// ============================================================================
// Permissions Layer (RBAC)
// ============================================================================
export { accessControl, owner } from './permissions'

// ============================================================================
// Server Layer
// ============================================================================
export {
  betterAuth,
  deleteSessionCookie,
  getChunkedCookie,
  getCookieCache,
  getCookies,
  getSessionCookie,
  toNodeHandler,
} from './server'

// ============================================================================
// Client Layer
// ============================================================================
export { createAuthClient, type AuthClient } from './client'

// ============================================================================
// Application Services
// ============================================================================
export { auth } from './application/services/auth-instance.service'
export {
  getUserSession,
  checkUserSession,
  type UserSession,
} from './application/services/session.service'

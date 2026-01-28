/**
 * Server-side type definitions
 */

import type { Session as BetterAuthSession } from 'better-auth'

/**
 * Extended session type with organization and impersonation support
 */
export interface ExtendedSession extends BetterAuthSession {
  activeOrganizationId: string | null
  activeTeamId: string | null
  impersonatedBy: string | null
  lastLoginMethod: string | null
}

// Re-export commonly used better-auth types
export type { Auth, BetterAuthOptions, Session, User } from 'better-auth'

/**
 * Trusted origins configuration
 */

import { parseCommaSeparated } from '../infrastructure/environment'
import { getAuthEnv } from '../infrastructure/environment'

/**
 * Gets the list of trusted origins for CORS and auth flows.
 * Reads from environment variables (AUTH_TRUSTED_ORIGINS or NEXT_PUBLIC_AUTH_TRUSTED_ORIGINS)
 * or returns default origins if not set.
 */
export const getTrustedOrigins = (): string[] => {
  const defaultOrigins = [
    'http://localhost:8000',
    'https://api.provadoo.com',
    'https://staging.api.provadoo.com',
    'http://localhost:3000',
  ]

  const env = getAuthEnv()
  const trustedOriginsEnv = env.trustedOrigins

  if (trustedOriginsEnv) {
    const parsed = parseCommaSeparated(trustedOriginsEnv)
    if (parsed.length > 0) {
      return parsed
    }
  }

  return defaultOrigins
}

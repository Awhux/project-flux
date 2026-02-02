/**
 * Main authentication instance service
 * Singleton that configures and exports the better-auth instance
 */

import { betterAuth } from '../../server/exports'
import { createAuthConfig } from '../../config/auth-config.factory'
import { getAuthEnv } from '../../infrastructure/environment'

/**
 * Creates the auth instance with environment-based configuration
 */
function createAuth() {
  const env = getAuthEnv()

  const authEnv = {
    appName: env.appName,
    googleClientId: env.googleClientId,
    googleClientSecret: env.googleClientSecret,
    isProduction: env.isProduction,
    cookies: env.cookieDomain
      ? {
        rootDomain: env.cookieDomain,
        laxDomains: env.cookieLaxDomains,
        secure: env.isProduction,
      }
      : undefined,
  }

  const authConfig = createAuthConfig(authEnv)
  return betterAuth(authConfig)
}

/**
 * Main auth instance - singleton
 */
export const auth = createAuth()

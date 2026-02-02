/**
 * Auth configuration factory for better-auth
 */

import type { BetterAuthOptions } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import {
  admin,
  lastLoginMethod,
  organization,
  twoFactor,
} from 'better-auth/plugins'
import { AUTH_COOKIE_LAST_LOGIN_METHOD_NAME, AUTH_COOKIE_PREFIX } from '../constants/auth.constants'
import { getAuthEnv } from '../infrastructure/environment'
import { accessControl, owner } from '../permissions'
import { createCookieConfig, getDefaultAdvancedConfig } from './cookie-config.factory'
import { getTrustedOrigins } from './trust-config'
import type { AuthConfigEnv } from './types'
import { prisma } from '@/features/database/server'

/**
 * Creates the authentication configuration for better-auth.
 *
 * @example
 * ```ts
 * import { createAuthConfig } from '@/features/auth'
 * import { betterAuth } from 'better-auth'
 *
 * const config = createAuthConfig({
 *   appName: 'My App',
 *   googleClientId: process.env.GOOGLE_CLIENT_ID,
 *   googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *   cookies: {
 *     rootDomain: 'plenus.one',
 *     laxDomains: 'app.custom-domain.com',
 *     secure: true,
 *   },
 * })
 *
 * export const auth = betterAuth(config)
 * ```
 */
export function createAuthConfig(
  config: AuthConfigEnv = {},
): BetterAuthOptions {
  const env = getAuthEnv()
  const isProduction = config.isProduction ?? env.isProduction
  const enableEmailAndPassword = !isProduction
    ? true
    : env.enableEmailAndPassword
  const enableSocialProviders = !isProduction ? true : env.enableSocialProviders

  // Merge config with environment variables (config takes precedence)
  const appName = config.appName || env.appName
  const googleClientId = config.googleClientId || env.googleClientId
  const googleClientSecret = config.googleClientSecret || env.googleClientSecret

  // Build advanced cookie configuration
  // When cookies config is provided, use it; otherwise use default config with domain from env
  const advancedConfig = config.cookies
    ? createCookieConfig(config.cookies, isProduction)
    : getDefaultAdvancedConfig(isProduction, env.cookieDomain)

  // Only include social providers if credentials are provided
  const hasSocialProviders = googleClientId && googleClientSecret
  const socialProviders = hasSocialProviders
    ? {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      },
    }
    : undefined

  return {
    appName,
    database: prismaAdapter(prisma, {
      provider: 'postgresql',
      debugLogs: false,
      transaction: false,
    }),
    emailAndPassword: {
      enabled: enableEmailAndPassword,
      disableSignUp: config.emailAndPassword?.disableSignUp ?? false,
      requireEmailVerification:
        config.emailAndPassword?.requireEmailVerification ?? false,
      minPasswordLength: config.emailAndPassword?.minPasswordLength ?? 8,
      maxPasswordLength: config.emailAndPassword?.maxPasswordLength ?? 64,
    },
    ...(enableSocialProviders && socialProviders && { socialProviders }),
    trustedOrigins: getTrustedOrigins(),
    logger: {
      level: isProduction ? 'warn' : 'info',
    },
    telemetry: {
      enabled: false,
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 2 * 60 * 60, // 2 hours
      },
    },
    user: {
      additionalFields: {
        first_name: {
          type: 'string',
          required: false,
          returned: true,
        },
        last_name: {
          type: 'string',
          required: false,
          returned: true,
        },
      },
    },
    plugins: [
      // lastLoginMethod({
      //   storeInDatabase: true,
      //   cookieName: `${AUTH_COOKIE_PREFIX}.${AUTH_COOKIE_LAST_LOGIN_METHOD_NAME}`,
      // }),
      admin(),
      twoFactor(),
      // organization({
      //   ac: accessControl,
      //   roles: { owner },
      //   teams: {
      //     enabled: true,
      //   },
      // }),
    ],
    advanced: advancedConfig,
  } satisfies BetterAuthOptions
}

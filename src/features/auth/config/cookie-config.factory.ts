/**
 * Cookie configuration factory for better-auth
 */

import type { BetterAuthOptions } from 'better-auth'
import {
  AUTH_COOKIE_PREFIX,
  AUTH_COOKIE_SESSION_NAME,
} from '../constants/auth.constants'
import { parseCommaSeparated } from '../infrastructure/environment'
import type { CookieConfig } from './types'

/**
 * Determines if a request origin should use SameSite=Lax cookies.
 */
export function shouldUseLaxCookies(
  origin: string | undefined,
  laxDomains: string[],
): boolean {
  if (!origin || laxDomains.length === 0) {
    return false
  }

  try {
    const url = new URL(origin)
    return laxDomains.some(
      (domain) =>
        url.hostname === domain || url.hostname.endsWith(`.${domain}`),
    )
  } catch {
    return false
  }
}

/**
 * Formats domain for cookie setting (adds leading dot for subdomain support).
 */
function formatCookieDomain(domain: string): string {
  // Remove any protocol
  let cleanDomain = domain.replace(/^https?:\/\//, '')
  // Remove any path
  cleanDomain = cleanDomain.split('/')[0]
  // Remove port
  cleanDomain = cleanDomain.split(':')[0]
  // Add leading dot for subdomain support if not localhost
  if (!cleanDomain.startsWith('.') && cleanDomain !== 'localhost') {
    return `.${cleanDomain}`
  }
  return cleanDomain
}

/**
 * Parses lax domains from string or array format.
 */
function parseLaxDomains(laxDomains?: string | string[]): string[] {
  if (!laxDomains) {
    return []
  }
  if (Array.isArray(laxDomains)) {
    return laxDomains
  }
  return parseCommaSeparated(laxDomains)
}

/**
 * Creates advanced cookie configuration for better-auth.
 * Configures all cookies that better-auth uses with proper domain attributes
 * for cross-subdomain access.
 */
export function createCookieConfig(
  config: CookieConfig,
  isProduction: boolean,
): NonNullable<BetterAuthOptions['advanced']> {
  const prefix = config.prefix || AUTH_COOKIE_PREFIX
  const secure = config.secure ?? isProduction
  const laxDomains = parseLaxDomains(config.laxDomains)

  // Domain configuration for cross-subdomain cookie access
  const domainAttributes = config.rootDomain
    ? { domain: formatCookieDomain(config.rootDomain) }
    : {}

  // Base attributes for session-related cookies (long-lived)
  const sessionCookieAttributes = {
    secure,
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    ...domainAttributes,
  }

  // Base attributes for state cookies (short-lived, used during OAuth flow)
  // IMPORTANT: OAuth state cookies MUST use SameSite=None to work with cross-site redirects
  // from OAuth providers (e.g., Google → api.plenus.one). SameSite=None requires Secure=true.
  const stateCookieAttributes = {
    secure: true, // Required for SameSite=None
    httpOnly: true,
    sameSite: 'none' as const, // Required for cross-site OAuth redirects
    maxAge: 60 * 10, // 10 minutes (for OAuth state)
    ...domainAttributes,
  }

  // Base attributes for non-httpOnly cookies (like session_data which needs client access)
  const clientAccessibleCookieAttributes = {
    secure,
    httpOnly: false,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    ...domainAttributes,
  }

  return {
    cookiePrefix: prefix,
    cookies: {
      // Main session token
      session_token: {
        name: `${prefix}.${AUTH_COOKIE_SESSION_NAME}`,
        attributes: sessionCookieAttributes,
      },
      // OAuth state cookie
      state: {
        name: `${prefix}.state`,
        attributes: stateCookieAttributes,
      },
      // Session data cookie (client-accessible for session caching)
      session_data: {
        name: `${prefix}.session_data`,
        attributes: clientAccessibleCookieAttributes,
      },
    },
    // Store lax domains for runtime checks
    // This allows the application to determine cookie behavior per-request
    ...(laxDomains.length > 0 && {
      crossSubdomainCookies: {
        enabled: true,
        domains: laxDomains,
      },
    }),
  }
}

/**
 * Creates default advanced configuration for better-auth.
 * Optionally includes domain attribute from environment for cross-subdomain support.
 */
export function getDefaultAdvancedConfig(
  isProduction: boolean,
  rootDomain?: string,
): NonNullable<BetterAuthOptions['advanced']> {
  // Domain configuration for cross-subdomain cookie access
  const domainAttributes = rootDomain
    ? { domain: formatCookieDomain(rootDomain) }
    : {}

  // Base attributes for session-related cookies (long-lived)
  const sessionCookieAttributes = {
    secure: isProduction,
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    ...domainAttributes,
  }

  // Base attributes for state cookies (short-lived, used during OAuth flow)
  // IMPORTANT: OAuth state cookies MUST use SameSite=None to work with cross-site redirects
  // from OAuth providers (e.g., Google → api.plenus.one). SameSite=None requires Secure=true.
  const stateCookieAttributes = {
    secure: true, // Required for SameSite=None
    httpOnly: true,
    sameSite: 'none' as const, // Required for cross-site OAuth redirects
    maxAge: 60 * 10, // 10 minutes (for OAuth state)
    ...domainAttributes,
  }

  // Base attributes for non-httpOnly cookies (like session_data which needs client access)
  const clientAccessibleCookieAttributes = {
    secure: isProduction,
    httpOnly: false,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    ...domainAttributes,
  }

  return {
    cookiePrefix: AUTH_COOKIE_PREFIX,
    cookies: {
      // Main session token
      session_token: {
        name: `${AUTH_COOKIE_PREFIX}.${AUTH_COOKIE_SESSION_NAME}`,
        attributes: sessionCookieAttributes,
      },
      // OAuth state cookie
      state: {
        name: `${AUTH_COOKIE_PREFIX}.state`,
        attributes: stateCookieAttributes,
      },
      // Session data cookie (client-accessible for session caching)
      session_data: {
        name: `${AUTH_COOKIE_PREFIX}.session_data`,
        attributes: clientAccessibleCookieAttributes,
      },
    },
  }
}

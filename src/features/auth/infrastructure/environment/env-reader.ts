import type { AuthEnvironment } from './types'

/**
 * Detects if code is running in a browser environment
 */
export function isBrowser(): boolean {
  return (
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as { window?: unknown }).window !== 'undefined'
  )
}

/**
 * Safely gets an environment variable, supporting both browser and Node.js environments.
 * In browser environments, only NEXT_PUBLIC_* variables are accessible.
 */
function getEnvVar(key: string, publicKey?: string): string | undefined {
  // In browser, try public key first
  if (isBrowser() && publicKey) {
    return (
      (typeof process !== 'undefined' && process.env?.[publicKey]) || undefined
    )
  }

  // In Node.js, try the regular key
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key]
  }

  return undefined
}

/**
 * Gets authentication environment configuration.
 * Automatically detects browser/server environment and reads appropriate variables.
 */
export function getAuthEnv(): AuthEnvironment {
  const isProduction =
    getEnvVar('NODE_ENV') === 'production' ||
    getEnvVar('NODE_ENV', 'NEXT_PUBLIC_NODE_ENV') === 'production'

  return {
    appName: getEnvVar('APP_NAME', 'NEXT_PUBLIC_APP_NAME') || 'Plenus',
    googleClientId: getEnvVar('GOOGLE_CLIENT_ID'),
    googleClientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
    trustedOrigins: getEnvVar(
      'AUTH_TRUSTED_ORIGINS',
      'NEXT_PUBLIC_AUTH_TRUSTED_ORIGINS',
    ),
    baseUrl: getEnvVar('AUTH_BASE_URL', 'NEXT_PUBLIC_API_BASE_URL'),
    cookieDomain: getEnvVar('AUTH_COOKIE_DOMAIN'),
    cookieLaxDomains: getEnvVar('AUTH_COOKIE_LAX_DOMAINS'),
    isProduction,
    enableEmailAndPassword: getEnvVar('ENABLE_EMAIL_AND_PASSWORD') === 'true',
    enableSocialProviders: getEnvVar('ENABLE_SOCIAL_PROVIDERS') === 'true',
  }
}

/**
 * Parses a comma-separated string into an array of trimmed strings.
 */
export function parseCommaSeparated(value: string | undefined): string[] {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Validates that required environment variables are set for server-side auth.
 * Throws an error if any required variables are missing.
 */
export function validateServerEnv(env: AuthEnvironment): void {
  const missing: string[] = []

  if (!env.googleClientId) {
    missing.push('GOOGLE_CLIENT_ID')
  }
  if (!env.googleClientSecret) {
    missing.push('GOOGLE_CLIENT_SECRET')
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required auth environment variables: ${missing.join(', ')}`,
    )
  }
}

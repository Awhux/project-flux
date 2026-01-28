/**
 * Authentication environment configuration interface
 */
export interface AuthEnvironment {
  /** Application name displayed in auth flows */
  appName: string
  /** Google OAuth client ID */
  googleClientId?: string
  /** Google OAuth client secret (server-side only) */
  googleClientSecret?: string
  /** Comma-separated list of trusted origins */
  trustedOrigins?: string
  /** Base URL for auth API (e.g., https://api.plenus.one) */
  baseUrl?: string
  /** Root domain for cookies (e.g., plenus.one) */
  cookieDomain?: string
  /** Comma-separated list of domains that should use SameSite=Lax */
  cookieLaxDomains?: string
  /** Whether the app is running in production */
  isProduction: boolean
  /** Whether email and password authentication is enabled */
  enableEmailAndPassword: boolean
  /** Whether social providers are enabled */
  enableSocialProviders: boolean
}

/**
 * Configuration types for auth feature
 */

/**
 * Cookie configuration options
 */
export interface CookieConfig {
  /**
   * Root domain for cookies (e.g., 'plenus.one').
   * When set, cookies will be accessible to all subdomains.
   * Should be prefixed with '.' for subdomain support (done automatically).
   */
  rootDomain?: string

  /**
   * Comma-separated string or array of specific domains that should use SameSite=Lax.
   * Use this for domains that need cross-site cookie access (e.g., custom domains).
   * @example 'app.example.com,dashboard.example.com'
   */
  laxDomains?: string | string[]

  /**
   * Force secure cookies (HTTPS only).
   * @default true in production, false in development
   */
  secure?: boolean

  /**
   * Cookie prefix for all auth cookies.
   * @default 'plenus'
   */
  prefix?: string
}

/**
 * Configuration options for creating the auth instance.
 */
export interface AuthConfigEnv {
  /** Application name displayed in auth flows */
  appName?: string
  /** Google OAuth client ID */
  googleClientId?: string
  /** Google OAuth client secret */
  googleClientSecret?: string
  /** Comma-separated list of trusted origins */
  trustedOrigins?: string
  /** Email and password configuration */
  emailAndPassword?: {
    disableSignUp?: boolean
    requireEmailVerification?: boolean
    minPasswordLength?: number
    maxPasswordLength?: number
  }
  /** Cookie configuration for production deployments */
  cookies?: CookieConfig
  /** Whether the app is running in production */
  isProduction?: boolean
}

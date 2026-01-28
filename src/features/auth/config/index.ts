// Configuration layer exports
export type { AuthConfigEnv, CookieConfig } from './types'
export { createAuthConfig } from './auth-config.factory'
export {
  createCookieConfig,
  getDefaultAdvancedConfig,
  shouldUseLaxCookies,
} from './cookie-config.factory'
export { getTrustedOrigins } from './trust-config'

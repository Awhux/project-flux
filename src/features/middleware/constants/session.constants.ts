import {
  AUTH_COOKIE_PREFIX,
  AUTH_COOKIE_SESSION_NAME,
} from '@/features/auth'

/**
 * Query parameter name used to signal invalid session from page/server component validation.
 * When a page detects an invalid session, it redirects with this parameter.
 * The middleware then cleans up cookies to prevent redirect loops.
 */
export const INVALID_SESSION_PARAM = 'invalid_session'

/**
 * Full cookie name for the session token cookie.
 */
export const SESSION_COOKIE_NAME = `${AUTH_COOKIE_PREFIX}.${AUTH_COOKIE_SESSION_NAME}`

/**
 * Full cookie name for the session data cookie (client-accessible).
 */
export const SESSION_DATA_COOKIE_NAME = `${AUTH_COOKIE_PREFIX}.session_data`


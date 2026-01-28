import type { NextRequest, NextResponse } from 'next/server'
import {
  SESSION_COOKIE_NAME,
  SESSION_DATA_COOKIE_NAME,
} from '../../constants/session.constants'

/**
 * Service for handling session cookie operations in middleware.
 * Provides methods to check cookie presence and delete authentication cookies.
 */
export const sessionCookieService = {
  /**
   * Checks if the session cookie exists in the request.
   * For performance, we only check cookie presence in middleware.
   * Full validation happens in pages/server components.
   *
   * @param request - The incoming NextRequest
   * @returns true if the session cookie exists, false otherwise
   */
  hasSessionCookie(request: NextRequest): boolean {
    return !!request.cookies.get(SESSION_COOKIE_NAME)?.value
  },

  /**
   * Deletes all authentication cookies from the response.
   * Used when invalid session is detected to prevent redirect loops.
   *
   * @param response - The NextResponse to modify
   */
  deleteAuthCookies(response: NextResponse): void {
    const cookiesToDelete = [SESSION_COOKIE_NAME, SESSION_DATA_COOKIE_NAME]

    for (const cookieName of cookiesToDelete) {
      response.cookies.delete(cookieName)
    }
  },
}

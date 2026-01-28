/**
 * Session management service
 * Utilities for working with user sessions in server components
 */

import { headers } from 'next/headers'
import {
  createSignInRedirectFromServerPage,
  INVALID_SESSION_PARAM,
} from '@/features/middleware'
import { APP_URL } from '@/utils/app/links'
import { auth } from './auth-instance.service'

/**
 * User session type
 */
export type UserSession = Awaited<ReturnType<typeof auth.api.getSession>>

/**
 * Validates user session and redirects to sign-in if invalid
 * @throws Redirects to sign-in page if session is invalid
 */
export async function checkUserSession(): Promise<void> {
  try {
    const session = await getUserSession()
    if (!session?.user?.id) {
      throw new Error('Invalid session')
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    if (errorMessage.includes('be rendered statically because it used')) {
      return
    }

    console.error(`Error validating session - error: ${errorMessage}`)
    createSignInRedirectFromServerPage({
      returnUrl: APP_URL.toString(),
      searchParams: {
        [INVALID_SESSION_PARAM]: '1',
      },
    })
  }
}

/**
 * Gets the current user session from cookies
 * @returns User session or null if not authenticated
 */
export async function getUserSession(): Promise<Awaited<
  ReturnType<typeof auth.api.getSession>
> | null> {
  return auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  })
}

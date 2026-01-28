import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { fromAppUrl } from '@/utils/app/links'
import { guestRouteMatcher } from './route-matchers'

export interface AuthRedirectOptions {
  /** The URL to return to after successful authentication (required) */
  returnUrl: string
  /** Additional query parameters to include in the redirect */
  searchParams?: Record<string, string>
}

export interface PostAuthRedirectOptions {
  /** Additional query parameters to include in the redirect */
  searchParams?: Record<string, string>
}

/**
 * Creates a redirect response to the sign-in page with return URL and optional parameters
 *
 * @param request - The incoming NextRequest
 * @param options - Redirect options including return URL and search parameters
 * @returns NextResponse redirect to sign-in page
 */
export function createSignInRedirect(
  _request: NextRequest,
  options: AuthRedirectOptions,
): NextResponse {
  const signInUrl = fromAppUrl('/auth/sign-in')
  signInUrl.searchParams.set('returnUrl', options.returnUrl)

  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      signInUrl.searchParams.set(key, value)
    }
  }

  return NextResponse.redirect(signInUrl)
}

/**
 * Creates a redirect response to the sign-in page from a server page
 *
 * @param options - Redirect options including return URL and optional search params
 * @returns void
 */
export function createSignInRedirectFromServerPage(
  options: AuthRedirectOptions,
): void {
  const signInUrl = fromAppUrl('/auth/sign-in')
  signInUrl.searchParams.set('returnUrl', options.returnUrl)

  // Add any additional search parameters (e.g., invalid_session signal)
  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      signInUrl.searchParams.set(key, value)
    }
  }

  redirect(signInUrl.href)
}

/**
 * Creates a redirect response to the sign-up page with return URL and optional parameters
 *
 * @param request - The incoming NextRequest
 * @param options - Redirect options including return URL and search parameters
 * @returns NextResponse redirect to sign-up page
 */
export function createSignUpRedirect(
  _request: NextRequest,
  options: AuthRedirectOptions,
): NextResponse {
  const signUpUrl = fromAppUrl('/auth/sign-up')
  signUpUrl.searchParams.set('returnUrl', options.returnUrl)

  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      signUpUrl.searchParams.set(key, value)
    }
  }

  return NextResponse.redirect(signUpUrl)
}

/**
 * Creates a redirect response for authenticated users coming from auth pages.
 * Automatically extracts the return URL and other parameters from the request
 *
 * @param request - The incoming NextRequest
 * @param options - Optional additional parameters to include
 * @returns NextResponse redirect to the return URL or default destination
 */
export function createPostAuthRedirect(
  request: NextRequest,
  options?: PostAuthRedirectOptions,
): NextResponse {
  const { searchParams } = request.nextUrl

  const returnUrl = searchParams.get('returnUrl') || '/'
  const destinationUrl = fromAppUrl(returnUrl)

  const returnUrlObj = new URL(returnUrl, request.url)
  for (const [key, value] of returnUrlObj.searchParams.entries()) {
    destinationUrl.searchParams.set(key, value)
  }

  if (options?.searchParams) {
    for (const [paramKey, value] of Object.entries(options.searchParams)) {
      destinationUrl.searchParams.set(paramKey, value)
    }
  }

  for (const [paramKey, value] of searchParams.entries()) {
    if (
      paramKey !== 'returnUrl' &&
      !destinationUrl.searchParams.has(paramKey)
    ) {
      destinationUrl.searchParams.set(paramKey, value)
    }
  }

  return NextResponse.redirect(destinationUrl)
}

/**
 * Authentication redirect handler that automatically handles both scenarios:
 * 1. Redirect unauthenticated users to sign-in with return URL
 * 2. Redirect authenticated users from auth pages to their intended destination
 *
 * @param request - The incoming NextRequest
 * @param hasCookie - Whether the session cookie is present
 * @param options - Redirect options
 * @param extraOptions - Additional options for logging
 * @returns NextResponse redirect or null if no redirect needed
 */
export function handleAuthRedirect(
  request: NextRequest,
  hasCookie: boolean,
  options: AuthRedirectOptions,
): NextResponse | null {
  const { pathname } = request.nextUrl

  // User with cookie trying to access guest routes (sign-in/sign-up)
  // Note: If cookie is invalid, page validation will catch it and redirect with invalid_session param
  if (hasCookie && guestRouteMatcher(request)) {
    return createPostAuthRedirect(request, options)
  }

  if (!(hasCookie || guestRouteMatcher(request))) {
    if (pathname.startsWith('/auth/sign-in')) {
      return NextResponse.next()
    }

    return createSignInRedirect(request, options)
  }

  return NextResponse.next()
}


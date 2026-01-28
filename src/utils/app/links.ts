import type { ReadonlyURLSearchParams } from 'next/navigation'

/**
 * The app URL, used to create links and handle them in the app.
 *
 * @example
 * ```ts
 * import { APP_URL } from "@/utils/app/links";
 *
 * const url = APP_URL.toString();
 * // "http://localhost:3000"
 *
 * const link = APP_URL.toString() + "/users/123";
 * // "http://localhost:3000/users/123"
 * ```
 */
export const APP_URL = new URL(
  process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
)

/**
 * The API URL, used to create links and handle them in the app.
 *
 * @example
 * ```ts
 * import { API_URL } from "@/utils/app/links";
 *
 * const url = API_URL.toString();
 * // "http://localhost:8000"
 *
 * const link = API_URL.toString() + "/users/123";
 * // "http://localhost:8000/users/123"
 * ```
 */
export const API_URL = new URL(
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000',
)

/**
 * Normalize a URL, removing any trailing slashes.
 *
 * @param url - The URL to normalize.
 * @returns The normalized URL.
 */
export function normalizeUrl(url: string): URL {
  return new URL(url.replace(/\/$/, ''))
}

/**
 * Create a link from a path.
 *
 * @param path - The path to create a link from.
 * @returns The link.
 */
export function fromAppUrl(path: string): URL {
  return new URL(path, APP_URL.toString())
}

/**
 * Create a link from an array of segments.
 *
 * @param segments - The segments to create a link from.
 * @returns The link.
 */
export function fromAppUrlSegments(segments: string[]): URL {
  const fullPath = segments
    .map((segment) => segment.trim())
    .join('/')
    .replace(/\/\//g, '/')

  return normalizeUrl(new URL(fullPath, APP_URL.toString()).toString())
}

/**
 * Gets the current callback URL from search params or defaults to dashboard
 *
 * @param searchParams - The search parameters object
 * @param fallbackPath - Optional fallback path (default: '/dashboard')
 * @returns The absolute URL to redirect to
 */
export function getCallbackURL(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
  fallbackPath = '/',
): string {
  const callbackURL = searchParams.get('returnUrl')

  if (callbackURL) {
    // If it's already an absolute URL that matches our APP_URL, return it
    // Otherwise construct it relative to APP_URL to prevent open redirect
    try {
      const url = new URL(callbackURL)
      if (url.origin === APP_URL.origin) {
        return url.toString()
      }
    } catch {
      // If new URL() fails, it might be a relative path
      return fromAppUrl(callbackURL).toString()
    }
  }

  return fromAppUrl(fallbackPath).toString()
}

/**
 * Client-side type definitions
 */

/**
 * Configuration options for creating the auth client.
 */
export interface CreateAuthClientOptions {
  /**
   * Base URL for the auth API.
   * Defaults to AUTH_BASE_URL or NEXT_PUBLIC_API_BASE_URL environment variable.
   */
  baseURL?: string

  /**
   * Base path for auth endpoints.
   * @default 'auth'
   */
  basePath?: string

  /**
   * Whether to include the organization plugin.
   * @default true
   */
  includeOrganization?: boolean

  /**
   * Additional fetch options for all auth requests.
   */
  fetchOptions?: {
    onError?: (e: { error: { status: number; message?: string } }) => void
    onSuccess?: (ctx: unknown) => void
    headers?: Record<string, string>
  }

  /**
   * Session options for caching and refetching.
   */
  sessionOptions?: {
    refetchOnWindowFocus?: boolean
    refetchWhenOffline?: boolean
    refetchInterval?: number
  }
}

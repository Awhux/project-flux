/**
 * Pre-configured auth client for browser and Node.js environments.
 * Includes all necessary client-side plugins matching the server configuration.
 */

import {
  lastLoginMethodClient,
  organizationClient,
} from 'better-auth/client/plugins'
import { createAuthClient as createBetterAuthClient } from 'better-auth/react'
import { getAuthEnv } from '../infrastructure/environment'
import type { CreateAuthClientOptions } from './types'

/**
 * Creates a pre-configured auth client with all necessary plugins.
 * This is the recommended way to create an auth client for your application.
 *
 * @example
 * ```ts
 * // Basic usage - uses environment variables for configuration
 * import { createAuthClient } from '@/features/auth'
 *
 * export const authClient = createAuthClient()
 *
 * // With custom options
 * export const authClient = createAuthClient({
 *   baseURL: 'https://api.example.com',
 *   fetchOptions: {
 *     onError: (e) => console.error(e)
 *   }
 * })
 * ```
 */
export function createAuthClient(options: CreateAuthClientOptions = {}) {
  const env = getAuthEnv()

  const {
    baseURL = env.baseUrl,
    basePath = 'api/auth',
    includeOrganization = true,
    fetchOptions,
    sessionOptions,
  } = options

  // Build plugins array based on options
  const plugins = [
    lastLoginMethodClient(),
    ...(includeOrganization ? [organizationClient()] : []),
  ]

  return createBetterAuthClient({
    baseURL,
    basePath,
    plugins,
    fetchOptions,
    session: sessionOptions,
  })
}

/**
 * Type of the auth client created by createAuthClient.
 */
export type AuthClient = ReturnType<typeof createAuthClient>

import { createAuthClient } from './auth-client.factory'

// Client-side exports
export { createAuthClient, type AuthClient } from './auth-client.factory'
export type { CreateAuthClientOptions } from './types'

export const authClient = createAuthClient()
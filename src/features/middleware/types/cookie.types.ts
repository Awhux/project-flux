import type { getCookieCache } from '@/features/auth'

/**
 * Type representing Better Auth cookie cache.
 */
export type BetterAuthCookie = Awaited<ReturnType<typeof getCookieCache>>


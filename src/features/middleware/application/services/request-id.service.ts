import { randomBytes } from 'node:crypto'

/**
 * Service for generating unique request IDs for audit trails.
 * Uses cryptographically secure random bytes for better security.
 *
 * Format: timestamp-randomhex
 * - timestamp: Date.now() in base36 for compact representation
 * - randomhex: 8 bytes of cryptographically secure random data in hex
 */
export const requestIdService = {
  /**
   * Generates a unique request ID for audit trail.
   * Uses crypto-based approach for security.
   *
   * @returns A unique request ID string in format: timestamp-randomhex
   */
  generate(): string {
    const timestamp = Date.now().toString(36)
    const random = randomBytes(8).toString('hex')
    return `${timestamp}-${random}`
  },
}


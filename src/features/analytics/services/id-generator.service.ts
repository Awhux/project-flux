/**
 * Analytics ID Generator Service
 *
 * Generates unique IDs for analytics API requests.
 */

import { randomUUID } from "crypto"

/**
 * Generate a request ID for API error tracking
 * Format: req_<uuid>
 */
export function generateRequestId(): string {
  return `req_${randomUUID().replace(/-/g, "").slice(0, 16)}`
}

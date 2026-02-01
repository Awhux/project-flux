/**
 * ID Generator Service
 * 
 * Generates unique IDs for links, clicks, and leads.
 * Uses crypto.randomUUID() for cryptographically secure IDs.
 */

import { randomUUID } from "crypto"

/**
 * Generate a unique ID for a link
 * Format: lnk_<uuid> (32 chars total with prefix)
 */
export function generateLinkId(): string {
  return `lnk_${randomUUID().replace(/-/g, "").slice(0, 24)}`
}

/**
 * Generate a unique ID for a click event
 * Format: clk_<uuid> (32 chars total with prefix)
 */
export function generateClickId(): string {
  return `clk_${randomUUID().replace(/-/g, "").slice(0, 24)}`
}

/**
 * Generate a unique ID for a lead
 * Format: led_<uuid> (32 chars total with prefix)
 */
export function generateLeadId(): string {
  return `led_${randomUUID().replace(/-/g, "").slice(0, 24)}`
}

/**
 * Generate a generic unique ID
 * Format: <prefix>_<uuid> where uuid is 24 chars
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 24)}`
}

/**
 * Generate a request ID for API error tracking
 * Format: req_<uuid>
 */
export function generateRequestId(): string {
  return `req_${randomUUID().replace(/-/g, "").slice(0, 16)}`
}

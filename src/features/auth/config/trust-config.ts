/**
 * Trusted origins configuration
 */

/**
 * Gets the list of trusted origins for CORS and auth flows.
 * Parses from environment or returns default origins.
 */
export const getTrustedOrigins = (origins?: string): string[] => {
  const defaultOrigins = [
    'http://localhost:8000',
    'https://api.provadoo.com',
    'https://staging.api.provadoo.com',
    'http://localhost:3000',
  ]

  if (origins) {
    return origins.split(',')
  }

  return defaultOrigins
}

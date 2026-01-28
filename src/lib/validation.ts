/**
 * Validate a slug (lowercase alphanumeric and hyphens only)
 * @example validateSlug("my-promo") // true
 * @example validateSlug("My Promo") // false
 */
export function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9-]+$/
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50
}

/**
 * Sanitize a slug (convert to valid format)
 * @example sanitizeSlug("My Promo!") // "my-promo"
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Validate an email address
 * @example validateEmail("user@example.com") // true
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate a URL
 * @example validateUrl("https://example.com") // true
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate Facebook Pixel ID (15-16 digits)
 * @example validatePixelId("123456789012345") // true
 */
export function validatePixelId(pixelId: string): boolean {
  const pixelRegex = /^\d{15,16}$/
  return pixelRegex.test(pixelId)
}

/**
 * Check if a string contains UTM parameters
 * @example hasUtmParams("Visit {{utm_source}}") // true
 */
export function hasUtmParams(text: string): boolean {
  const utmRegex = /\{\{utm_(source|medium|campaign|content|term)\}\}/
  return utmRegex.test(text)
}

/**
 * Extract UTM variables from text
 * @example extractUtmVariables("Visit {{utm_source}} from {{utm_campaign}}") 
 * // ["utm_source", "utm_campaign"]
 */
export function extractUtmVariables(text: string): string[] {
  const utmRegex = /\{\{(utm_(?:source|medium|campaign|content|term))\}\}/g
  const matches = [...text.matchAll(utmRegex)]
  return matches.map((match) => match[1])
}

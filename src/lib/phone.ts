/**
 * Format a Brazilian phone number
 * @example formatPhoneNumber("11987654321") // "(11) 98765-4321"
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "")
  
  // Check if it's a valid Brazilian number (11 digits with country code, or 10-11 without)
  if (cleaned.length === 13 && cleaned.startsWith("55")) {
    // Has country code
    const ddd = cleaned.slice(2, 4)
    const firstPart = cleaned.slice(4, 9)
    const secondPart = cleaned.slice(9, 13)
    return `+55 (${ddd}) ${firstPart}-${secondPart}`
  } else if (cleaned.length === 11) {
    // No country code, mobile number
    const ddd = cleaned.slice(0, 2)
    const firstPart = cleaned.slice(2, 7)
    const secondPart = cleaned.slice(7, 11)
    return `(${ddd}) ${firstPart}-${secondPart}`
  } else if (cleaned.length === 10) {
    // No country code, landline number
    const ddd = cleaned.slice(0, 2)
    const firstPart = cleaned.slice(2, 6)
    const secondPart = cleaned.slice(6, 10)
    return `(${ddd}) ${firstPart}-${secondPart}`
  }
  
  // Return original if format is not recognized
  return phone
}

/**
 * Sanitize a phone number to only numbers
 * @example sanitizePhoneNumber("+55 (11) 98765-4321") // "5511987654321"
 */
export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, "")
}

/**
 * Validate a Brazilian phone number
 * @example validatePhoneNumber("11987654321") // true
 */
export function validatePhoneNumber(phone: string): boolean {
  const cleaned = sanitizePhoneNumber(phone)
  
  // Brazilian numbers: 10 or 11 digits without country code, or 12-13 with country code
  if (cleaned.length === 10 || cleaned.length === 11) {
    return true
  }
  
  if ((cleaned.length === 12 || cleaned.length === 13) && cleaned.startsWith("55")) {
    return true
  }
  
  return false
}

/**
 * Add country code to phone number if not present
 * @example addCountryCode("11987654321") // "5511987654321"
 */
export function addCountryCode(phone: string): string {
  const cleaned = sanitizePhoneNumber(phone)
  
  if (cleaned.startsWith("55")) {
    return cleaned
  }
  
  return `55${cleaned}`
}

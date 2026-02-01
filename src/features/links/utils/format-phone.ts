/**
 * Formats a phone number for display (Brazilian format)
 */
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "")

  if (digits.length === 0) return ""
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

/**
 * Validates a Brazilian phone number
 */
export function validatePhoneNumber(value: string): boolean {
  const digits = value.replace(/\D/g, "")
  return digits.length === 11 && digits[2] === "9"
}

/**
 * Returns phone validation error message in Portuguese
 */
export function getPhoneError(value: string): string | undefined {
  if (!value) return "Número de telefone é obrigatório"
  if (!validatePhoneNumber(value)) return "Digite um número de telefone válido"
  return undefined
}

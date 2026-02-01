import { SLUG_MIN_LENGTH, SLUG_MAX_LENGTH } from "../config"

/**
 * Validates a link slug
 * @returns Error message in Portuguese or undefined if valid
 */
export function validateSlug(value: string): string | undefined {
  if (!value) return "Slug é obrigatório"
  if (value.length < SLUG_MIN_LENGTH)
    return `Slug deve ter pelo menos ${SLUG_MIN_LENGTH} caracteres`
  if (value.length > SLUG_MAX_LENGTH)
    return `Slug deve ter menos de ${SLUG_MAX_LENGTH} caracteres`
  if (!/^[a-z0-9-]+$/.test(value))
    return "Use apenas letras minúsculas, números e hífens"
  if (value.startsWith("-") || value.endsWith("-"))
    return "Slug não pode começar ou terminar com hífen"
  return undefined
}

/**
 * Normalizes slug input
 */
export function normalizeSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, "")
}

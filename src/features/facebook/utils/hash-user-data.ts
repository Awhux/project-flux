/**
 * SHA256 Hashing Utilities for Facebook CAPI
 *
 * Facebook requires all PII (Personally Identifiable Information) to be
 * hashed with SHA256 before sending to the Conversions API.
 *
 * @see https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
 */

import { createHash } from "crypto"

/**
 * Hash a string using SHA256
 * Returns lowercase hex-encoded hash
 */
export function sha256Hash(value: string): string {
  return createHash("sha256").update(value).digest("hex")
}

/**
 * Normalize and hash an email address
 *
 * Normalization rules:
 * 1. Convert to lowercase
 * 2. Trim leading/trailing whitespace
 * 3. Remove leading/trailing whitespace around @ symbol
 *
 * @param email - Raw email address
 * @returns SHA256 hash of normalized email, or undefined if invalid
 */
export function hashEmail(email: string | null | undefined): string | undefined {
  if (!email || typeof email !== "string") {
    return undefined
  }

  const normalized = email.toLowerCase().trim()

  // Basic email validation
  if (!normalized.includes("@") || normalized.length < 5) {
    return undefined
  }

  return sha256Hash(normalized)
}

/**
 * Normalize and hash a phone number
 *
 * Normalization rules:
 * 1. Remove all non-numeric characters
 * 2. Should include country code (e.g., 5511999999999 for Brazil)
 *
 * @param phone - Raw phone number
 * @returns SHA256 hash of normalized phone, or undefined if invalid
 */
export function hashPhone(phone: string | null | undefined): string | undefined {
  if (!phone || typeof phone !== "string") {
    return undefined
  }

  // Remove all non-numeric characters
  const normalized = phone.replace(/\D/g, "")

  // Minimum length check (country code + number)
  if (normalized.length < 10) {
    return undefined
  }

  return sha256Hash(normalized)
}

/**
 * Normalize and hash a name (first name or last name)
 *
 * Normalization rules:
 * 1. Convert to lowercase
 * 2. Trim leading/trailing whitespace
 * 3. Remove extra internal whitespace
 *
 * @param name - Raw name
 * @returns SHA256 hash of normalized name, or undefined if invalid
 */
export function hashName(name: string | null | undefined): string | undefined {
  if (!name || typeof name !== "string") {
    return undefined
  }

  const normalized = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ") // Collapse multiple spaces

  if (normalized.length === 0) {
    return undefined
  }

  return sha256Hash(normalized)
}

/**
 * Normalize and hash a city name
 *
 * Normalization rules:
 * 1. Convert to lowercase
 * 2. Remove all spaces
 * 3. Remove special characters (keep only a-z)
 *
 * @param city - Raw city name
 * @returns SHA256 hash of normalized city, or undefined if invalid
 */
export function hashCity(city: string | null | undefined): string | undefined {
  if (!city || typeof city !== "string") {
    return undefined
  }

  const normalized = city
    .toLowerCase()
    .replace(/\s+/g, "") // Remove all spaces
    .replace(/[^a-z]/g, "") // Keep only letters

  if (normalized.length === 0) {
    return undefined
  }

  return sha256Hash(normalized)
}

/**
 * Normalize and hash a state/province code
 *
 * Normalization rules:
 * 1. Convert to lowercase
 * 2. Should be 2-letter code (e.g., "SP" for São Paulo)
 *
 * @param state - Raw state code
 * @returns SHA256 hash of normalized state, or undefined if invalid
 */
export function hashState(state: string | null | undefined): string | undefined {
  if (!state || typeof state !== "string") {
    return undefined
  }

  const normalized = state.toLowerCase().trim().replace(/[^a-z]/g, "")

  // State codes are typically 2 characters
  if (normalized.length < 2) {
    return undefined
  }

  return sha256Hash(normalized)
}

/**
 * Normalize and hash a zip/postal code
 *
 * Normalization rules:
 * 1. Remove all non-alphanumeric characters
 * 2. Convert to lowercase
 *
 * @param zipCode - Raw zip/postal code
 * @returns SHA256 hash of normalized zip code, or undefined if invalid
 */
export function hashZipCode(zipCode: string | null | undefined): string | undefined {
  if (!zipCode || typeof zipCode !== "string") {
    return undefined
  }

  const normalized = zipCode.toLowerCase().replace(/[^a-z0-9]/g, "")

  if (normalized.length < 3) {
    return undefined
  }

  return sha256Hash(normalized)
}

/**
 * Normalize and hash a country code
 *
 * Normalization rules:
 * 1. Convert to lowercase
 * 2. Should be 2-letter ISO 3166-1 alpha-2 code
 *
 * @param country - Raw country code
 * @returns SHA256 hash of normalized country, or undefined if invalid
 */
export function hashCountry(country: string | null | undefined): string | undefined {
  if (!country || typeof country !== "string") {
    return undefined
  }

  const normalized = country.toLowerCase().trim()

  // Country codes must be exactly 2 characters
  if (normalized.length !== 2) {
    return undefined
  }

  return sha256Hash(normalized)
}

/**
 * Normalize and hash an external ID
 *
 * @param externalId - Raw external ID
 * @returns SHA256 hash of the ID, or undefined if invalid
 */
export function hashExternalId(externalId: string | null | undefined): string | undefined {
  if (!externalId || typeof externalId !== "string") {
    return undefined
  }

  const normalized = externalId.trim()

  if (normalized.length === 0) {
    return undefined
  }

  return sha256Hash(normalized)
}

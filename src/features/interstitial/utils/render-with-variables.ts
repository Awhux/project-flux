/**
 * Utility functions for handling message variables in interstitial pages
 */

/**
 * Pattern to match UTM variables like {{utm_source}}, {{utm_campaign}}, etc.
 */
const VARIABLE_PATTERN = /\{\{(\w+)\}\}/g

/**
 * UTM variable names that can be used in messages
 */
export const UTM_VARIABLE_NAMES = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
] as const

export type UtmVariableName = (typeof UTM_VARIABLE_NAMES)[number]

/**
 * UTM values mapping
 */
export type UtmValues = Partial<Record<UtmVariableName, string>>

/**
 * Extract all variable names from a message template
 * 
 * @param message - The message template
 * @returns Array of variable names (without braces)
 * 
 * @example
 * extractVariables("Hello {{utm_source}}!") // ["utm_source"]
 */
export function extractVariables(message: string): string[] {
  const matches = message.matchAll(VARIABLE_PATTERN)
  const variables: string[] = []

  for (const match of matches) {
    if (!variables.includes(match[1])) {
      variables.push(match[1])
    }
  }

  return variables
}

/**
 * Check if a message contains any variables
 * 
 * @param message - The message to check
 * @returns True if the message contains variables
 */
export function hasVariables(message: string): boolean {
  return VARIABLE_PATTERN.test(message)
}

/**
 * Get the variable syntax for inserting into a message
 * 
 * @param variableName - The variable name (e.g., "utm_source")
 * @returns The variable syntax (e.g., "{{utm_source}}")
 */
export function getVariableSyntax(variableName: string): string {
  return `{{${variableName}}}`
}

/**
 * Render a message template with actual values
 * 
 * @param message - The message template with {{variable}} syntax
 * @param values - Object mapping variable names to their values
 * @param options - Rendering options
 * @returns The rendered message with values substituted
 * 
 * @example
 * renderMessageWithValues(
 *   "Hi from {{utm_source}}!",
 *   { utm_source: "facebook" }
 * ) // "Hi from facebook!"
 */
export function renderMessageWithValues(
  message: string,
  values: UtmValues,
  options: {
    /** Show placeholder for missing values instead of keeping syntax */
    showPlaceholder?: boolean
    /** Custom placeholder format, receives variable name */
    placeholderFormat?: (variableName: string) => string
  } = {}
): string {
  const {
    showPlaceholder = true,
    placeholderFormat = (name) => `[${name}]`,
  } = options

  return message.replace(VARIABLE_PATTERN, (match, variableName: string) => {
    const value = values[variableName as UtmVariableName]

    if (value) {
      return value
    }

    if (showPlaceholder) {
      return placeholderFormat(variableName)
    }

    return match
  })
}

/**
 * Validate that a message only uses known UTM variables
 * 
 * @param message - The message to validate
 * @returns Object with validation result and any unknown variables
 */
export function validateMessageVariables(message: string): {
  isValid: boolean
  unknownVariables: string[]
} {
  const variables = extractVariables(message)
  const unknownVariables = variables.filter(
    (v) => !UTM_VARIABLE_NAMES.includes(v as UtmVariableName)
  )

  return {
    isValid: unknownVariables.length === 0,
    unknownVariables,
  }
}

/**
 * Format a variable name for display (human-readable)
 * 
 * @param variableName - The variable name (e.g., "utm_source")
 * @returns Human-readable format (e.g., "UTM Source")
 */
export function formatVariableNameForDisplay(variableName: string): string {
  return variableName
    .replace(/_/g, " ")
    .replace(/utm/i, "UTM")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Get information about which variables in a message have values
 * 
 * @param message - The message template
 * @param values - The UTM values
 * @returns Information about variable status
 */
export function getVariableStatus(
  message: string,
  values: UtmValues
): {
  total: number
  filled: number
  missing: string[]
  variables: Array<{
    name: string
    hasValue: boolean
    value?: string
  }>
} {
  const variables = extractVariables(message)
  const missing: string[] = []
  const variableStatus = variables.map((name) => {
    const value = values[name as UtmVariableName]
    if (!value) {
      missing.push(name)
    }
    return {
      name,
      hasValue: !!value,
      value,
    }
  })

  return {
    total: variables.length,
    filled: variables.length - missing.length,
    missing,
    variables: variableStatus,
  }
}

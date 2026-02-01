/**
 * Formats a number with Brazilian locale (pt-BR)
 * @param value - Number to format
 * @returns Formatted string with thousand separators
 */
export function formatNumber(value: number): string {
  return value.toLocaleString("pt-BR")
}

/**
 * Formats a number as percentage
 * @param value - Number to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Formats a number as currency (BRL)
 * @param value - Number to format as currency
 * @returns Formatted currency string
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

/**
 * Abbreviates large numbers (1000 -> 1K, 1000000 -> 1M)
 * @param value - Number to abbreviate
 * @returns Abbreviated string
 */
export function abbreviateNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }
  return value.toString()
}

/**
 * Calculates percentage of a value relative to a total
 * @param value - Current value
 * @param total - Total value
 * @returns Percentage (0-100)
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}

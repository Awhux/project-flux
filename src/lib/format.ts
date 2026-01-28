/**
 * Format a number with thousand separators
 * @example formatNumber(1234) // "1,234"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

/**
 * Format a percentage
 * @example formatPercentage(0.1234) // "12.3%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format a date relative to now
 * @example formatRelativeDate(new Date(Date.now() - 86400000)) // "1 day ago"
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSecs < 60) return "just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`
  return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`
}

/**
 * Format a date as absolute date
 * @example formatAbsoluteDate(new Date()) // "Jan 26, 2026"
 */
export function formatAbsoluteDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

/**
 * Format a date with time
 * @example formatDateTime(new Date()) // "Jan 26, 2026 at 14:32"
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

/**
 * Format currency (Brazilian Real)
 * @example formatCurrency(1234.56) // "R$ 1.234,56"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

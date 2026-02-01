/**
 * Formats a date to Brazilian format (dd/mm/yyyy)
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR")
}

/**
 * Formats a date with time (dd/mm/yyyy às HH:mm)
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Returns relative time in Portuguese (hoje, ontem, há X dias)
 * @param date - Date to compare
 * @returns Relative time string in Portuguese
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return "hoje"
  if (days === 1) return "ontem"
  if (days < 7) return `há ${days} dias`
  if (days < 14) return "há 1 semana"
  if (days < 30) return `há ${Math.floor(days / 7)} semanas`
  if (days < 60) return "há 1 mês"
  return `há ${Math.floor(days / 30)} meses`
}

/**
 * Formats time only (HH:mm)
 * @param date - Date to extract time from
 * @returns Formatted time string
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Formats a date for display (ex: 24 Jan, 2026)
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

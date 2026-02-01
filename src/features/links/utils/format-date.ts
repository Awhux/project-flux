/**
 * Formats a date to relative time in Portuguese
 */
export function formatRelativeDate(date: Date): string {
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

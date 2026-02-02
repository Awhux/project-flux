import type { ApiLead, DisplayLead, Lead } from "../types"

/**
 * Formats a date for display in Portuguese
 */
export function formatLeadDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/**
 * Formats time for display
 */
export function formatLeadTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Transforms Lead to DisplayLead for table display
 */
export function transformLeadForDisplay(lead: Lead): DisplayLead {
  return {
    ...lead,
    capturedAt: formatLeadDate(lead.convertedAt),
    capturedTime: formatLeadTime(lead.convertedAt),
  }
}

/**
 * Transforms API Lead to DisplayLead for table display
 */
export function transformApiLeadForDisplay(apiLead: ApiLead): DisplayLead {
  const convertedAt = new Date(apiLead.convertedAt)

  return {
    id: apiLead.id,
    name: apiLead.name,
    email: apiLead.email,
    phone: apiLead.phone,
    linkId: apiLead.linkId,
    linkSlug: apiLead.linkSlug,
    utmSource: apiLead.utmSource,
    utmMedium: apiLead.utmMedium,
    utmCampaign: apiLead.utmCampaign,
    utmContent: apiLead.utmContent,
    capturedAt: formatLeadDate(convertedAt),
    capturedTime: formatLeadTime(convertedAt),
  }
}

/**
 * Gets initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Gets avatar color based on name
 */
export function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-600 text-white",
    "bg-green-600 text-white",
    "bg-purple-600 text-white",
    "bg-orange-600 text-white",
    "bg-pink-600 text-white",
    "bg-teal-600 text-white",
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

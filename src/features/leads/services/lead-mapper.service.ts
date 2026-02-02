/**
 * Lead Mapper Service
 * 
 * Transforms Prisma Lead models to API responses.
 * Follows SOLID Single Responsibility Principle.
 */

import type { Lead } from "@prisma/client"
import type { ApiLead } from "../types"

/**
 * Transform Prisma Lead to API Lead format
 */
export function prismaLeadToApiLead(
  lead: Lead & { link: { slug: string } }
): ApiLead {
  return {
    id: lead.id,
    name: lead.name || "Sem nome",
    email: lead.email,
    phone: formatPhoneForDisplay(lead.phone),
    linkId: lead.linkId,
    linkSlug: lead.link.slug,
    utmSource: lead.utmSource,
    utmMedium: lead.utmMedium,
    utmCampaign: lead.utmCampaign,
    utmContent: lead.utmContent,
    convertedAt: lead.convertedAt.toISOString(),
  }
}

/**
 * Format phone number for display
 * Adds Brazilian formatting if the phone number is valid
 */
export function formatPhoneForDisplay(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "")

  // Format Brazilian phone number
  if (cleaned.length === 11) {
    // Mobile: (XX) XXXXX-XXXX
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  } else if (cleaned.length === 10) {
    // Landline: (XX) XXXX-XXXX
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  } else if (cleaned.length === 13 && cleaned.startsWith("55")) {
    // International format with country code
    return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`
  }

  // Return as-is if format is not recognized
  return phone
}

/**
 * Transform API Lead to domain Lead
 */
export function apiLeadToDomainLead(apiLead: ApiLead): {
  id: string
  name: string
  email: string | null
  phone: string
  linkId: string
  linkSlug: string
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmContent: string | null
  convertedAt: Date
} {
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
    convertedAt: new Date(apiLead.convertedAt),
  }
}

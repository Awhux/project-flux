/**
 * WhatsApp URL Service
 * 
 * Generates WhatsApp URLs with pre-filled messages,
 * replacing UTM variables in message templates.
 */

export interface UtmParams {
  source?: string
  medium?: string
  campaign?: string
  content?: string
  term?: string
}

/**
 * Build WhatsApp URL with pre-filled message
 * 
 * @param phone - Phone number (digits only or with country code)
 * @param messageTemplate - Message template with optional {{utm_*}} placeholders
 * @param utmParams - UTM parameters to replace in the message
 * @returns Full WhatsApp URL
 */
export function buildWhatsAppUrl(
  phone: string,
  messageTemplate: string,
  utmParams: UtmParams = {}
): string {
  // Remove all non-digit characters from phone
  const phoneNumber = phone.replace(/\D/g, "")

  // Replace UTM variables in message template
  const message = renderMessageWithUtm(messageTemplate, utmParams)

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message.trim())

  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}

/**
 * Render message template with UTM values
 * 
 * Replaces {{utm_source}}, {{utm_medium}}, {{utm_campaign}}, 
 * {{utm_content}}, and {{utm_term}} with actual values.
 * 
 * @param template - Message template with {{utm_*}} placeholders
 * @param utmParams - UTM parameters to insert
 * @returns Rendered message with variables replaced
 */
export function renderMessageWithUtm(
  template: string,
  utmParams: UtmParams
): string {
  let message = template

  // Replace each UTM variable
  const replacements: Record<string, string | undefined> = {
    "{{utm_source}}": utmParams.source,
    "{{utm_medium}}": utmParams.medium,
    "{{utm_campaign}}": utmParams.campaign,
    "{{utm_content}}": utmParams.content,
    "{{utm_term}}": utmParams.term,
  }

  for (const [placeholder, value] of Object.entries(replacements)) {
    // Replace with value or empty string if not provided
    message = message.replace(new RegExp(escapeRegex(placeholder), "gi"), value || "")
  }

  // Clean up any double spaces that might result from empty replacements
  message = message.replace(/\s+/g, " ").trim()

  return message
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Extract UTM parameters from URL search params
 */
export function extractUtmFromSearchParams(
  searchParams: URLSearchParams | Record<string, string | undefined>
): UtmParams {
  if (searchParams instanceof URLSearchParams) {
    return {
      source: searchParams.get("utm_source") || undefined,
      medium: searchParams.get("utm_medium") || undefined,
      campaign: searchParams.get("utm_campaign") || undefined,
      content: searchParams.get("utm_content") || undefined,
      term: searchParams.get("utm_term") || undefined,
    }
  }

  return {
    source: searchParams.utm_source || undefined,
    medium: searchParams.utm_medium || undefined,
    campaign: searchParams.utm_campaign || undefined,
    content: searchParams.utm_content || undefined,
    term: searchParams.utm_term || undefined,
  }
}

/**
 * Build UTM query string from params
 */
export function buildUtmQueryString(utmParams: UtmParams): string {
  const params = new URLSearchParams()

  if (utmParams.source) params.set("utm_source", utmParams.source)
  if (utmParams.medium) params.set("utm_medium", utmParams.medium)
  if (utmParams.campaign) params.set("utm_campaign", utmParams.campaign)
  if (utmParams.content) params.set("utm_content", utmParams.content)
  if (utmParams.term) params.set("utm_term", utmParams.term)

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ""
}

/**
 * Check if a message template contains UTM variables
 */
export function hasUtmVariables(template: string): boolean {
  return /\{\{utm_(source|medium|campaign|content|term)\}\}/i.test(template)
}

/**
 * Get list of UTM variables used in a template
 */
export function getUsedUtmVariables(template: string): string[] {
  const variables: string[] = []
  const regex = /\{\{(utm_(?:source|medium|campaign|content|term))\}\}/gi
  let match

  while ((match = regex.exec(template)) !== null) {
    const varName = match[1].toLowerCase()
    if (!variables.includes(varName)) {
      variables.push(varName)
    }
  }

  return variables
}

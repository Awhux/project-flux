/**
 * Device Detection Service
 * 
 * Detects device type from User-Agent string for click analytics.
 */

import type { DeviceType } from "@prisma/client"

/**
 * Detect device type from User-Agent string
 * 
 * @param userAgent - The User-Agent header value
 * @returns DeviceType enum value
 */
export function detectDeviceType(userAgent: string | null): DeviceType {
  if (!userAgent) {
    return "OTHER"
  }

  const ua = userAgent.toLowerCase()

  // Check for tablets first (they often include 'mobile' too)
  if (
    /ipad|tablet|playbook|silk/i.test(ua) ||
    (/android/i.test(ua) && !/mobile/i.test(ua))
  ) {
    return "TABLET"
  }

  // Check for mobile devices
  if (
    /mobile|iphone|ipod|android.*mobile|windows phone|webos|blackberry|opera mini|opera mobi|iemobile/i.test(
      ua
    )
  ) {
    return "MOBILE"
  }

  // Check for desktop indicators
  if (/windows|macintosh|linux/i.test(ua) && !/mobile/i.test(ua)) {
    return "DESKTOP"
  }

  // Unknown device
  return "OTHER"
}

/**
 * Get device type display name (Portuguese)
 */
export function getDeviceDisplayName(deviceType: DeviceType): string {
  const names: Record<DeviceType, string> = {
    MOBILE: "Celular",
    DESKTOP: "Desktop",
    TABLET: "Tablet",
    OTHER: "Outro",
  }
  return names[deviceType] || "Desconhecido"
}

/**
 * Check if device is mobile (including tablets)
 */
export function isMobileDevice(deviceType: DeviceType): boolean {
  return deviceType === "MOBILE" || deviceType === "TABLET"
}

/**
 * Extract browser name from User-Agent
 */
export function detectBrowser(userAgent: string | null): string {
  if (!userAgent) return "Unknown"

  const ua = userAgent.toLowerCase()

  if (ua.includes("edg/")) return "Edge"
  if (ua.includes("chrome/") && !ua.includes("chromium/")) return "Chrome"
  if (ua.includes("safari/") && !ua.includes("chrome/") && !ua.includes("chromium/")) return "Safari"
  if (ua.includes("firefox/")) return "Firefox"
  if (ua.includes("opera/") || ua.includes("opr/")) return "Opera"
  if (ua.includes("msie") || ua.includes("trident/")) return "Internet Explorer"

  return "Other"
}

/**
 * Extract OS name from User-Agent
 */
export function detectOS(userAgent: string | null): string {
  if (!userAgent) return "Unknown"

  const ua = userAgent.toLowerCase()

  if (ua.includes("windows nt 10")) return "Windows 10"
  if (ua.includes("windows nt 6.3")) return "Windows 8.1"
  if (ua.includes("windows nt 6.2")) return "Windows 8"
  if (ua.includes("windows nt 6.1")) return "Windows 7"
  if (ua.includes("windows")) return "Windows"
  if (ua.includes("mac os x")) return "macOS"
  if (ua.includes("android")) return "Android"
  if (ua.includes("iphone") || ua.includes("ipad")) return "iOS"
  if (ua.includes("linux")) return "Linux"

  return "Other"
}

/**
 * Facebook Conversions API (CAPI) Feature
 *
 * Server-side tracking integration for Facebook Pixel.
 * Bypasses client-side tracking blockers (iOS 14+, ad blockers)
 * for more accurate attribution.
 *
 * @example
 * ```typescript
 * import { sendFacebookEventAsync } from "@/features/facebook"
 *
 * // Fire-and-forget pattern for redirects
 * if (link.pixelId && link.capiToken) {
 *   sendFacebookEventAsync({
 *     pixelId: link.pixelId,
 *     accessToken: link.capiToken,
 *     eventName: "PageView",
 *     eventSourceUrl: request.url,
 *     userData: {
 *       clientIpAddress: ipAddress,
 *       clientUserAgent: userAgent,
 *       fbp: fbp,
 *       fbc: fbc,
 *     },
 *   })
 * }
 * ```
 */

export * from "./services"
export * from "./types"
export * from "./utils"

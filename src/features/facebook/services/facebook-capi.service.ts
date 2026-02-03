/**
 * Facebook Conversions API (CAPI) Service
 *
 * Handles sending server-side events to Facebook's Conversions API.
 * This bypasses client-side tracking blockers (iOS 14+, ad blockers)
 * for more accurate attribution.
 *
 * @see https://developers.facebook.com/docs/marketing-api/conversions-api
 */

import type {
  SendFacebookEventInput,
  SendFacebookEventResult,
  FacebookCAPIPayload,
  FacebookCAPISuccessResponse,
  FacebookCAPIErrorResponse,
  FacebookCAPIConfig,
  DEFAULT_FACEBOOK_CAPI_CONFIG,
} from "../types/facebook.types"
import { buildPageViewEvent, buildLeadEvent } from "./event-builder.service"

// =============================================================================
// Configuration
// =============================================================================

const config: FacebookCAPIConfig = {
  apiVersion: "v21.0",
  baseUrl: "https://graph.facebook.com",
  timeoutMs: 5000,
}

/**
 * Build the CAPI endpoint URL for a given Pixel ID
 */
function buildEndpointUrl(pixelId: string): string {
  return `${config.baseUrl}/${config.apiVersion}/${pixelId}/events`
}

// =============================================================================
// Core API Function
// =============================================================================

/**
 * Send events to Facebook Conversions API
 *
 * @param input - Event input data
 * @returns Promise resolving to the result
 */
export async function sendFacebookEvent(
  input: SendFacebookEventInput
): Promise<SendFacebookEventResult> {
  const {
    pixelId,
    accessToken,
    eventName,
    eventSourceUrl,
    userData,
    customData,
    eventId,
    testEventCode,
  } = input

  // Validate required fields
  if (!pixelId || !accessToken) {
    return {
      success: false,
      error: "Missing pixelId or accessToken",
    }
  }

  // Build event based on event name
  let event
  switch (eventName) {
    case "PageView":
      event = buildPageViewEvent(userData, eventSourceUrl || "", eventId)
      break
    case "Lead":
      event = buildLeadEvent(userData, eventSourceUrl || "", eventId, customData)
      break
    default:
      // For other events, build a generic event
      event = buildPageViewEvent(userData, eventSourceUrl || "", eventId)
      event.event_name = eventName
      if (customData) {
        event.custom_data = customData
      }
  }

  // Override event_id if explicitly provided
  if (eventId) {
    event.event_id = eventId
  }

  // Build payload
  const payload: FacebookCAPIPayload = {
    data: [event],
    access_token: accessToken,
  }

  // Add test event code if provided (for debugging)
  if (testEventCode) {
    payload.test_event_code = testEventCode
  }

  // Build endpoint URL
  const url = buildEndpointUrl(pixelId)

  try {
    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs)

    // Make the API request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Parse response
    const responseData = await response.json()

    if (!response.ok) {
      const errorResponse = responseData as FacebookCAPIErrorResponse
      return {
        success: false,
        error: errorResponse.error?.message || `HTTP ${response.status}`,
        fbtraceId: errorResponse.error?.fbtrace_id,
      }
    }

    const successResponse = responseData as FacebookCAPISuccessResponse
    return {
      success: true,
      eventsReceived: successResponse.events_received,
      fbtraceId: successResponse.fbtrace_id,
    }
  } catch (error) {
    // Handle timeout
    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        error: "Request timeout",
      }
    }

    // Handle other errors
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// =============================================================================
// Convenience Functions
// =============================================================================

/**
 * Send a PageView event to Facebook CAPI
 *
 * Use this when a user clicks a link to track the page view.
 * This is a fire-and-forget function - it doesn't block execution.
 *
 * @param pixelId - Facebook Pixel ID
 * @param accessToken - CAPI Access Token
 * @param eventSourceUrl - URL of the page/link
 * @param userData - User data for matching
 * @param linkId - Optional link ID for event deduplication
 */
export async function sendPageViewEvent(
  pixelId: string,
  accessToken: string,
  eventSourceUrl: string,
  userData: SendFacebookEventInput["userData"],
  linkId?: string
): Promise<SendFacebookEventResult> {
  return sendFacebookEvent({
    pixelId,
    accessToken,
    eventName: "PageView",
    eventSourceUrl,
    userData,
    eventId: linkId,
  })
}

/**
 * Send a Lead event to Facebook CAPI
 *
 * Use this when a user submits a lead capture form.
 * This is a fire-and-forget function - it doesn't block execution.
 *
 * @param pixelId - Facebook Pixel ID
 * @param accessToken - CAPI Access Token
 * @param eventSourceUrl - URL of the page/link
 * @param userData - User data for matching (include email/phone)
 * @param linkId - Optional link ID for event deduplication
 */
export async function sendLeadEvent(
  pixelId: string,
  accessToken: string,
  eventSourceUrl: string,
  userData: SendFacebookEventInput["userData"],
  linkId?: string
): Promise<SendFacebookEventResult> {
  return sendFacebookEvent({
    pixelId,
    accessToken,
    eventName: "Lead",
    eventSourceUrl,
    userData,
    eventId: linkId,
  })
}

/**
 * Send a Contact event to Facebook CAPI
 *
 * Use this when a user initiates contact (e.g., WhatsApp redirect).
 * This is a fire-and-forget function - it doesn't block execution.
 *
 * @param pixelId - Facebook Pixel ID
 * @param accessToken - CAPI Access Token
 * @param eventSourceUrl - URL of the page/link
 * @param userData - User data for matching
 * @param linkId - Optional link ID for event deduplication
 */
export async function sendContactEvent(
  pixelId: string,
  accessToken: string,
  eventSourceUrl: string,
  userData: SendFacebookEventInput["userData"],
  linkId?: string
): Promise<SendFacebookEventResult> {
  return sendFacebookEvent({
    pixelId,
    accessToken,
    eventName: "Contact",
    eventSourceUrl,
    userData,
    eventId: linkId,
  })
}

// =============================================================================
// Fire-and-Forget Helper
// =============================================================================

/**
 * Send a Facebook event without waiting for the response
 *
 * This is useful for redirect handlers where you don't want to block
 * the redirect while waiting for the API response. Errors are logged
 * but don't affect the main flow.
 *
 * @param input - Event input data
 * @param logPrefix - Optional prefix for log messages
 */
export function sendFacebookEventAsync(
  input: SendFacebookEventInput,
  logPrefix = "Facebook CAPI"
): void {
  // Fire and forget - don't await
  sendFacebookEvent(input)
    .then((result) => {
      if (!result.success) {
        console.error(`[${logPrefix}] Failed to send event:`, result.error)
      }
    })
    .catch((error) => {
      console.error(`[${logPrefix}] Error sending event:`, error)
    })
}

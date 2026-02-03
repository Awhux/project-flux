/**
 * Facebook Event Builder Service
 *
 * Constructs properly formatted event payloads for the Facebook Conversions API.
 * Handles user data normalization, hashing, and event ID generation.
 */

import { randomUUID } from "crypto"
import type {
  FacebookEvent,
  FacebookUserData,
  FacebookUserDataInput,
  FacebookCustomData,
  FacebookEventName,
  FacebookActionSource,
} from "../types/facebook.types"
import {
  hashEmail,
  hashPhone,
  hashName,
  hashCity,
  hashState,
  hashZipCode,
  hashCountry,
  hashExternalId,
} from "../utils/hash-user-data"

// =============================================================================
// User Data Builder
// =============================================================================

/**
 * Build Facebook user_data object with hashed PII
 *
 * @param input - Raw user data input
 * @returns Formatted user_data object for CAPI
 */
export function buildUserData(input: FacebookUserDataInput): FacebookUserData {
  const userData: FacebookUserData = {}

  // Required fields for web events (not hashed)
  if (input.clientIpAddress) {
    userData.client_ip_address = input.clientIpAddress
  }

  if (input.clientUserAgent) {
    userData.client_user_agent = input.clientUserAgent
  }

  // Facebook tracking IDs (not hashed)
  if (input.fbp) {
    userData.fbp = input.fbp
  }

  if (input.fbc) {
    userData.fbc = input.fbc
  }

  // PII fields (hashed with SHA256)
  const hashedEmail = hashEmail(input.email)
  if (hashedEmail) {
    userData.em = hashedEmail
  }

  const hashedPhone = hashPhone(input.phone)
  if (hashedPhone) {
    userData.ph = hashedPhone
  }

  const hashedFirstName = hashName(input.firstName)
  if (hashedFirstName) {
    userData.fn = hashedFirstName
  }

  const hashedLastName = hashName(input.lastName)
  if (hashedLastName) {
    userData.ln = hashedLastName
  }

  const hashedCity = hashCity(input.city)
  if (hashedCity) {
    userData.ct = hashedCity
  }

  const hashedState = hashState(input.state)
  if (hashedState) {
    userData.st = hashedState
  }

  const hashedZipCode = hashZipCode(input.zipCode)
  if (hashedZipCode) {
    userData.zp = hashedZipCode
  }

  const hashedCountry = hashCountry(input.country)
  if (hashedCountry) {
    userData.country = hashedCountry
  }

  const hashedExternalId = hashExternalId(input.externalId)
  if (hashedExternalId) {
    userData.external_id = hashedExternalId
  }

  return userData
}

// =============================================================================
// Event ID Generation
// =============================================================================

/**
 * Generate a unique event ID for deduplication
 *
 * The event_id is used to deduplicate events between browser pixel
 * and server-side CAPI. Using UUID ensures uniqueness.
 *
 * @param prefix - Optional prefix for the event ID
 * @returns Unique event ID string
 */
export function generateEventId(prefix?: string): string {
  const uuid = randomUUID()
  return prefix ? `${prefix}-${uuid}` : uuid
}

/**
 * Generate a deterministic event ID based on input parameters
 *
 * Use this when you need the same event_id for browser and server events
 * to enable deduplication.
 *
 * @param linkId - Link ID
 * @param eventName - Event name
 * @param timestamp - Unix timestamp in seconds
 * @returns Deterministic event ID
 */
export function generateDeterministicEventId(
  linkId: string,
  eventName: string,
  timestamp: number
): string {
  return `${linkId}-${eventName}-${timestamp}`
}

// =============================================================================
// Event Builders
// =============================================================================

interface BuildEventOptions {
  eventName: FacebookEventName | string
  userData: FacebookUserDataInput
  eventSourceUrl?: string
  eventId?: string
  customData?: FacebookCustomData
  actionSource?: FacebookActionSource
  eventTime?: number
}

/**
 * Build a complete Facebook event object
 *
 * @param options - Event building options
 * @returns Complete FacebookEvent object
 */
export function buildEvent(options: BuildEventOptions): FacebookEvent {
  const {
    eventName,
    userData,
    eventSourceUrl,
    eventId,
    customData,
    actionSource = "website",
    eventTime = Math.floor(Date.now() / 1000),
  } = options

  const event: FacebookEvent = {
    event_name: eventName,
    event_time: eventTime,
    action_source: actionSource,
    user_data: buildUserData(userData),
  }

  if (eventSourceUrl) {
    event.event_source_url = eventSourceUrl
  }

  if (eventId) {
    event.event_id = eventId
  } else {
    // Generate a unique event ID if not provided
    event.event_id = generateEventId(eventName)
  }

  if (customData && Object.keys(customData).length > 0) {
    event.custom_data = customData
  }

  return event
}

/**
 * Build a PageView event for link clicks
 *
 * @param userData - User data input
 * @param eventSourceUrl - URL where the event occurred
 * @param linkId - Link ID for event ID generation
 * @returns Complete PageView event
 */
export function buildPageViewEvent(
  userData: FacebookUserDataInput,
  eventSourceUrl: string,
  linkId?: string
): FacebookEvent {
  const timestamp = Math.floor(Date.now() / 1000)

  return buildEvent({
    eventName: "PageView",
    userData,
    eventSourceUrl,
    eventId: linkId
      ? generateDeterministicEventId(linkId, "PageView", timestamp)
      : generateEventId("PageView"),
    eventTime: timestamp,
  })
}

/**
 * Build a Lead event for form submissions
 *
 * @param userData - User data input (with contact info)
 * @param eventSourceUrl - URL where the event occurred
 * @param linkId - Link ID for event ID generation
 * @param customData - Optional custom data
 * @returns Complete Lead event
 */
export function buildLeadEvent(
  userData: FacebookUserDataInput,
  eventSourceUrl: string,
  linkId?: string,
  customData?: FacebookCustomData
): FacebookEvent {
  const timestamp = Math.floor(Date.now() / 1000)

  return buildEvent({
    eventName: "Lead",
    userData,
    eventSourceUrl,
    eventId: linkId
      ? generateDeterministicEventId(linkId, "Lead", timestamp)
      : generateEventId("Lead"),
    customData,
    eventTime: timestamp,
  })
}

/**
 * Build a ViewContent event for content views
 *
 * @param userData - User data input
 * @param eventSourceUrl - URL where the event occurred
 * @param contentName - Name of the content viewed
 * @param linkId - Link ID for event ID generation
 * @returns Complete ViewContent event
 */
export function buildViewContentEvent(
  userData: FacebookUserDataInput,
  eventSourceUrl: string,
  contentName?: string,
  linkId?: string
): FacebookEvent {
  const timestamp = Math.floor(Date.now() / 1000)

  const customData: FacebookCustomData = {}
  if (contentName) {
    customData.content_name = contentName
  }

  return buildEvent({
    eventName: "ViewContent",
    userData,
    eventSourceUrl,
    eventId: linkId
      ? generateDeterministicEventId(linkId, "ViewContent", timestamp)
      : generateEventId("ViewContent"),
    customData: Object.keys(customData).length > 0 ? customData : undefined,
    eventTime: timestamp,
  })
}

/**
 * Build a Contact event for when users initiate contact
 *
 * @param userData - User data input
 * @param eventSourceUrl - URL where the event occurred
 * @param linkId - Link ID for event ID generation
 * @returns Complete Contact event
 */
export function buildContactEvent(
  userData: FacebookUserDataInput,
  eventSourceUrl: string,
  linkId?: string
): FacebookEvent {
  const timestamp = Math.floor(Date.now() / 1000)

  return buildEvent({
    eventName: "Contact",
    userData,
    eventSourceUrl,
    eventId: linkId
      ? generateDeterministicEventId(linkId, "Contact", timestamp)
      : generateEventId("Contact"),
    eventTime: timestamp,
  })
}

/**
 * Build a custom event with a user-defined name
 *
 * @param eventName - Custom event name
 * @param userData - User data input
 * @param eventSourceUrl - URL where the event occurred
 * @param customData - Custom event data
 * @param linkId - Link ID for event ID generation
 * @returns Complete custom event
 */
export function buildCustomEvent(
  eventName: string,
  userData: FacebookUserDataInput,
  eventSourceUrl: string,
  customData?: FacebookCustomData,
  linkId?: string
): FacebookEvent {
  const timestamp = Math.floor(Date.now() / 1000)

  return buildEvent({
    eventName,
    userData,
    eventSourceUrl,
    eventId: linkId
      ? generateDeterministicEventId(linkId, eventName, timestamp)
      : generateEventId(eventName),
    customData,
    eventTime: timestamp,
  })
}

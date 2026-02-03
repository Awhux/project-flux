/**
 * Facebook Conversions API (CAPI) Type Definitions
 *
 * Based on Meta's Conversions API documentation:
 * https://developers.facebook.com/docs/marketing-api/conversions-api/parameters
 */

// =============================================================================
// Standard Event Names
// =============================================================================

/**
 * Standard Facebook event names supported by CAPI
 */
export type FacebookEventName =
  | "PageView"
  | "ViewContent"
  | "Search"
  | "AddToCart"
  | "AddToWishlist"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase"
  | "Lead"
  | "CompleteRegistration"
  | "Contact"
  | "CustomizeProduct"
  | "Donate"
  | "FindLocation"
  | "Schedule"
  | "StartTrial"
  | "SubmitApplication"
  | "Subscribe"

/**
 * Action source indicates where the event occurred
 */
export type FacebookActionSource =
  | "website"
  | "app"
  | "phone_call"
  | "chat"
  | "email"
  | "physical_store"
  | "system_generated"
  | "other"

// =============================================================================
// User Data Types
// =============================================================================

/**
 * User data fields that can be sent to Facebook
 * All PII fields should be hashed with SHA256 before sending
 */
export interface FacebookUserData {
  /**
   * Client IP address (required for web events)
   * Format: IPv4 or IPv6
   */
  client_ip_address?: string

  /**
   * Client User Agent (required for web events)
   * Full user agent string from browser
   */
  client_user_agent?: string

  /**
   * Facebook Browser ID cookie (_fbp)
   * Format: fb.1.1558571054389.1098115397
   */
  fbp?: string

  /**
   * Facebook Click ID cookie (_fbc)
   * Format: fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
   */
  fbc?: string

  /**
   * Email address (hashed with SHA256)
   * Normalize: lowercase, trim whitespace
   */
  em?: string

  /**
   * Phone number (hashed with SHA256)
   * Normalize: digits only, include country code
   */
  ph?: string

  /**
   * First name (hashed with SHA256)
   * Normalize: lowercase, trim whitespace
   */
  fn?: string

  /**
   * Last name (hashed with SHA256)
   * Normalize: lowercase, trim whitespace
   */
  ln?: string

  /**
   * City (hashed with SHA256)
   * Normalize: lowercase, remove spaces
   */
  ct?: string

  /**
   * State/Province (hashed with SHA256)
   * Normalize: 2-letter code, lowercase
   */
  st?: string

  /**
   * Zip/Postal code (hashed with SHA256)
   */
  zp?: string

  /**
   * Country (hashed with SHA256)
   * Format: 2-letter ISO 3166-1 alpha-2 code, lowercase
   */
  country?: string

  /**
   * External ID - any unique ID from advertiser
   * (hashed with SHA256)
   */
  external_id?: string
}

/**
 * Input user data before hashing (used in service layer)
 */
export interface FacebookUserDataInput {
  clientIpAddress?: string | null
  clientUserAgent?: string | null
  fbp?: string | null
  fbc?: string | null
  email?: string | null
  phone?: string | null
  firstName?: string | null
  lastName?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  country?: string | null
  externalId?: string | null
}

// =============================================================================
// Custom Data Types
// =============================================================================

/**
 * Content item for e-commerce events
 */
export interface FacebookContentItem {
  id: string
  quantity?: number
  item_price?: number
  delivery_category?: "in_store" | "curbside" | "home_delivery"
}

/**
 * Custom data for additional event parameters
 */
export interface FacebookCustomData {
  /**
   * Currency code (ISO 4217)
   */
  currency?: string

  /**
   * Total value of the event
   */
  value?: number

  /**
   * Content name
   */
  content_name?: string

  /**
   * Content category
   */
  content_category?: string

  /**
   * Content IDs
   */
  content_ids?: string[]

  /**
   * Content type
   */
  content_type?: "product" | "product_group"

  /**
   * Array of content items
   */
  contents?: FacebookContentItem[]

  /**
   * Number of items
   */
  num_items?: number

  /**
   * Search string
   */
  search_string?: string

  /**
   * Order ID for deduplication
   */
  order_id?: string

  /**
   * Status of the event
   */
  status?: string
}

// =============================================================================
// Event Types
// =============================================================================

/**
 * Single event in the CAPI payload
 */
export interface FacebookEvent {
  /**
   * Event name (standard or custom)
   */
  event_name: FacebookEventName | string

  /**
   * Unix timestamp in seconds when the event occurred
   */
  event_time: number

  /**
   * Where the event originated
   */
  action_source: FacebookActionSource

  /**
   * User data for matching
   */
  user_data: FacebookUserData

  /**
   * Custom data with event-specific parameters
   */
  custom_data?: FacebookCustomData

  /**
   * URL where the event occurred
   */
  event_source_url?: string

  /**
   * Unique event ID for deduplication
   * If browser pixel and CAPI send same event, use same ID
   */
  event_id?: string

  /**
   * Opt-out flag - if true, event won't be used for ads
   */
  opt_out?: boolean

  /**
   * Data processing options for privacy compliance
   */
  data_processing_options?: string[]

  /**
   * Country for data processing (0 for geolocation)
   */
  data_processing_options_country?: number

  /**
   * State for data processing (0 for geolocation)
   */
  data_processing_options_state?: number
}

// =============================================================================
// Request/Response Types
// =============================================================================

/**
 * Full payload sent to Facebook CAPI
 */
export interface FacebookCAPIPayload {
  /**
   * Array of events (max 1000 per request)
   */
  data: FacebookEvent[]

  /**
   * Access token for authentication
   */
  access_token: string

  /**
   * Test event code for debugging (optional)
   * Events with this code appear in Events Manager Test Events tab
   */
  test_event_code?: string
}

/**
 * Successful response from Facebook CAPI
 */
export interface FacebookCAPISuccessResponse {
  /**
   * Number of events received
   */
  events_received: number

  /**
   * Unique Facebook trace ID for debugging
   */
  fbtrace_id: string

  /**
   * Messages about the events (warnings, etc.)
   */
  messages?: string[]
}

/**
 * Error response from Facebook CAPI
 */
export interface FacebookCAPIErrorResponse {
  error: {
    message: string
    type: string
    code: number
    error_subcode?: number
    fbtrace_id: string
  }
}

/**
 * Union type for CAPI response
 */
export type FacebookCAPIResponse =
  | FacebookCAPISuccessResponse
  | FacebookCAPIErrorResponse

// =============================================================================
// Service Input Types
// =============================================================================

/**
 * Input for sending a Facebook event
 */
export interface SendFacebookEventInput {
  /**
   * Facebook Pixel ID
   */
  pixelId: string

  /**
   * CAPI Access Token
   */
  accessToken: string

  /**
   * Event name
   */
  eventName: FacebookEventName | string

  /**
   * URL where the event occurred
   */
  eventSourceUrl?: string

  /**
   * User data for matching
   */
  userData: FacebookUserDataInput

  /**
   * Custom data with event parameters
   */
  customData?: FacebookCustomData

  /**
   * Unique event ID for deduplication
   */
  eventId?: string

  /**
   * Test event code (for debugging)
   */
  testEventCode?: string
}

/**
 * Result from sending a Facebook event
 */
export interface SendFacebookEventResult {
  success: boolean
  eventsReceived?: number
  fbtraceId?: string
  error?: string
}

// =============================================================================
// Configuration Types
// =============================================================================

/**
 * Facebook CAPI configuration
 */
export interface FacebookCAPIConfig {
  /**
   * API version to use (e.g., "v21.0")
   */
  apiVersion: string

  /**
   * Base URL for Graph API
   */
  baseUrl: string

  /**
   * Request timeout in milliseconds
   */
  timeoutMs: number
}

/**
 * Default CAPI configuration
 */
export const DEFAULT_FACEBOOK_CAPI_CONFIG: FacebookCAPIConfig = {
  apiVersion: "v21.0",
  baseUrl: "https://graph.facebook.com",
  timeoutMs: 5000,
}

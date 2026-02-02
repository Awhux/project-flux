/**
 * Analytics Configuration
 *
 * UI configuration options for the analytics feature.
 * No mock data - all data comes from the API.
 */

/**
 * Date range options in Portuguese
 */
export const dateRangeOptions = [
  { value: "7", label: "7 dias" },
  { value: "30", label: "30 dias" },
  { value: "90", label: "90 dias" },
] as const

/**
 * UTM tab options in Portuguese
 */
export const utmTabOptions = [
  { value: "source", label: "Origem" },
  { value: "medium", label: "Mídia" },
  { value: "campaign", label: "Campanha" },
  { value: "content", label: "Conteúdo" },
] as const

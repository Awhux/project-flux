// Components
export { InterstitialPage, InterstitialFormFields, TrustElements } from "./components"

// Hooks
export { useInterstitialPreview } from "./hooks"
export type { PreviewMode, MessagePreviewMode } from "./hooks"

// Types
export type {
  InterstitialConfig,
  InterstitialFormData,
  InterstitialPageProps,
  InterstitialFormFieldsProps,
  TrustElementsProps,
  InterstitialTheme,
  Testimonial,
  SecurityBadge,
} from "./types"
export { DEFAULT_INTERSTITIAL_CONFIG, SECURITY_BADGES } from "./types"

// Utils
export {
  extractVariables,
  hasVariables,
  renderMessageWithValues,
  validateMessageVariables,
  formatVariableNameForDisplay,
  getVariableStatus,
  getVariableSyntax,
  UTM_VARIABLE_NAMES,
} from "./utils"
export type { UtmValues, UtmVariableName } from "./utils"

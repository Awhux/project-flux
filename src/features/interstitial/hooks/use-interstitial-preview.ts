"use client"

import * as React from "react"
import type { InterstitialFormData } from "../types"

/**
 * Preview modes for the interstitial page
 */
export type PreviewMode = "mobile" | "desktop"
export type MessagePreviewMode = "template" | "rendered"

/**
 * Hook for managing interstitial preview state
 */
export function useInterstitialPreview() {
  const [deviceView, setDeviceView] = React.useState<PreviewMode>("mobile")
  const [messagePreviewMode, setMessagePreviewMode] = React.useState<MessagePreviewMode>("rendered")

  // Preview form data state (for demonstration)
  const [previewFormData, setPreviewFormData] = React.useState<InterstitialFormData>({
    name: "",
    email: "",
    phone: "",
    privacyAccepted: false,
  })

  const toggleDeviceView = React.useCallback(() => {
    setDeviceView((prev) => (prev === "mobile" ? "desktop" : "mobile"))
  }, [])

  const toggleMessagePreviewMode = React.useCallback(() => {
    setMessagePreviewMode((prev) => (prev === "template" ? "rendered" : "template"))
  }, [])

  const resetPreviewFormData = React.useCallback(() => {
    setPreviewFormData({
      name: "",
      email: "",
      phone: "",
      privacyAccepted: false,
    })
  }, [])

  return {
    deviceView,
    setDeviceView,
    toggleDeviceView,
    messagePreviewMode,
    setMessagePreviewMode,
    toggleMessagePreviewMode,
    previewFormData,
    setPreviewFormData,
    resetPreviewFormData,
  }
}

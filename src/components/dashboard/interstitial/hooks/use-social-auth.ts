"use client"

import * as React from "react"

export type SocialProvider = "google" | "facebook" | "instagram" | "tiktok"

export interface SocialUserData {
  name?: string
  email?: string
  avatar?: string
  provider: SocialProvider
}

export interface UseSocialAuthReturn {
  userData: SocialUserData | null
  isLoading: boolean
  error: string | null
  loginWithGoogle: () => void
  loginWithFacebook: () => void
  loginWithInstagram: () => void
  loginWithTikTok: () => void
  clearData: () => void
}

// Decode JWT token (for Google)
function decodeJwt(token: string): Record<string, unknown> {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch {
    return {}
  }
}

// Load Facebook SDK
function loadFacebookSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window not available"))
      return
    }

    // Check if already loaded
    if ((window as unknown as { FB?: unknown }).FB) {
      resolve()
      return
    }

    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
    if (!appId) {
      reject(new Error("Facebook App ID not configured"))
      return
    }

    // Load the SDK asynchronously
    const script = document.createElement("script")
    script.src = "https://connect.facebook.net/en_US/sdk.js"
    script.async = true
    script.defer = true
    script.crossOrigin = "anonymous"

    script.onload = () => {
      const FB = (window as unknown as { FB: {
        init: (config: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void
      } }).FB
      FB.init({
        appId,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      })
      resolve()
    }

    script.onerror = () => reject(new Error("Failed to load Facebook SDK"))
    document.body.appendChild(script)
  })
}

export function useSocialAuth(): UseSocialAuthReturn {
  const [userData, setUserData] = React.useState<SocialUserData | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Google Login using @react-oauth/google credential response
  const loginWithGoogle = React.useCallback(() => {
    setIsLoading(true)
    setError(null)

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) {
      setError("Google Client ID não configurado")
      setIsLoading(false)
      return
    }

    // Use Google's OAuth 2.0 implicit flow
    const redirectUri = window.location.origin + "/interstitial/google-callback"
    const scope = "openid profile email"
    const responseType = "token id_token"

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("redirect_uri", redirectUri)
    authUrl.searchParams.set("response_type", responseType)
    authUrl.searchParams.set("scope", scope)
    authUrl.searchParams.set("nonce", Math.random().toString(36).substring(2))

    // Open popup
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    const popup = window.open(
      authUrl.toString(),
      "google-auth",
      `width=${width},height=${height},left=${left},top=${top}`
    )

    if (!popup) {
      setError("Pop-up bloqueado. Permita pop-ups para continuar.")
      setIsLoading(false)
      return
    }

    // Listen for the callback
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data?.type === "google-auth-success") {
        const { id_token } = event.data
        const decoded = decodeJwt(id_token)

        setUserData({
          name: decoded.name as string,
          email: decoded.email as string,
          avatar: decoded.picture as string,
          provider: "google",
        })
        setIsLoading(false)
        popup.close()
      } else if (event.data?.type === "google-auth-error") {
        setError(event.data.error || "Falha ao autenticar com Google")
        setIsLoading(false)
        popup.close()
      }

      window.removeEventListener("message", handleMessage)
    }

    window.addEventListener("message", handleMessage)

    // Check if popup was closed without completing
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        window.removeEventListener("message", handleMessage)
        setIsLoading(false)
      }
    }, 500)
  }, [])

  // Facebook Login
  const loginWithFacebook = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await loadFacebookSdk()

      const FB = (window as unknown as { FB: {
        login: (callback: (response: { authResponse?: { accessToken: string } }) => void, options: { scope: string }) => void
        api: (path: string, callback: (response: { name?: string; email?: string; picture?: { data?: { url?: string } }; error?: { message: string } }) => void) => void
      } }).FB

      FB.login(
        (response) => {
          if (response.authResponse) {
            // Get user info
            FB.api("/me?fields=name,email,picture.type(large)", (userInfo) => {
              if (userInfo.error) {
                setError(userInfo.error.message)
                setIsLoading(false)
                return
              }

              setUserData({
                name: userInfo.name,
                email: userInfo.email,
                avatar: userInfo.picture?.data?.url,
                provider: "facebook",
              })
              setIsLoading(false)
            })
          } else {
            setError("Login com Facebook cancelado")
            setIsLoading(false)
          }
        },
        { scope: "public_profile,email" }
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao conectar com Facebook")
      setIsLoading(false)
    }
  }, [])

  // Instagram Login (via Facebook Graph API)
  const loginWithInstagram = React.useCallback(() => {
    setIsLoading(true)
    setError(null)

    const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID || process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
    if (!appId) {
      setError("Instagram App ID não configurado")
      setIsLoading(false)
      return
    }

    // Instagram Basic Display API OAuth
    const redirectUri = window.location.origin + "/interstitial/instagram-callback"
    const scope = "user_profile"

    const authUrl = new URL("https://api.instagram.com/oauth/authorize")
    authUrl.searchParams.set("client_id", appId)
    authUrl.searchParams.set("redirect_uri", redirectUri)
    authUrl.searchParams.set("scope", scope)
    authUrl.searchParams.set("response_type", "code")

    // Open popup
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    const popup = window.open(
      authUrl.toString(),
      "instagram-auth",
      `width=${width},height=${height},left=${left},top=${top}`
    )

    if (!popup) {
      setError("Pop-up bloqueado. Permita pop-ups para continuar.")
      setIsLoading(false)
      return
    }

    // Listen for the callback
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data?.type === "instagram-auth-success") {
        setUserData({
          name: event.data.username,
          avatar: event.data.profile_picture,
          provider: "instagram",
        })
        setIsLoading(false)
        popup.close()
      } else if (event.data?.type === "instagram-auth-error") {
        setError(event.data.error || "Falha ao autenticar com Instagram")
        setIsLoading(false)
        popup.close()
      }

      window.removeEventListener("message", handleMessage)
    }

    window.addEventListener("message", handleMessage)

    // Check if popup was closed without completing
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        window.removeEventListener("message", handleMessage)
        setIsLoading(false)
      }
    }, 500)
  }, [])

  // TikTok Login
  const loginWithTikTok = React.useCallback(() => {
    setIsLoading(true)
    setError(null)

    const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY
    if (!clientKey) {
      setError("TikTok Client Key não configurado")
      setIsLoading(false)
      return
    }

    // TikTok Login Kit OAuth
    const redirectUri = window.location.origin + "/interstitial/tiktok-callback"
    const scope = "user.info.basic"
    const state = Math.random().toString(36).substring(2)

    const authUrl = new URL("https://www.tiktok.com/v2/auth/authorize/")
    authUrl.searchParams.set("client_key", clientKey)
    authUrl.searchParams.set("redirect_uri", redirectUri)
    authUrl.searchParams.set("scope", scope)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("state", state)

    // Open popup
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    const popup = window.open(
      authUrl.toString(),
      "tiktok-auth",
      `width=${width},height=${height},left=${left},top=${top}`
    )

    if (!popup) {
      setError("Pop-up bloqueado. Permita pop-ups para continuar.")
      setIsLoading(false)
      return
    }

    // Listen for the callback
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data?.type === "tiktok-auth-success") {
        setUserData({
          name: event.data.display_name || event.data.username,
          avatar: event.data.avatar_url,
          provider: "tiktok",
        })
        setIsLoading(false)
        popup.close()
      } else if (event.data?.type === "tiktok-auth-error") {
        setError(event.data.error || "Falha ao autenticar com TikTok")
        setIsLoading(false)
        popup.close()
      }

      window.removeEventListener("message", handleMessage)
    }

    window.addEventListener("message", handleMessage)

    // Check if popup was closed without completing
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        window.removeEventListener("message", handleMessage)
        setIsLoading(false)
      }
    }, 500)
  }, [])

  const clearData = React.useCallback(() => {
    setUserData(null)
    setError(null)
  }, [])

  return {
    userData,
    isLoading,
    error,
    loginWithGoogle,
    loginWithFacebook,
    loginWithInstagram,
    loginWithTikTok,
    clearData,
  }
}

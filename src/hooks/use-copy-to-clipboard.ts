"use client"

import * as React from "react"

interface UseCopyToClipboardReturn {
  isCopied: boolean
  copyToClipboard: (text: string) => Promise<void>
}

/**
 * Hook to copy text to clipboard with feedback
 * @example
 * const { isCopied, copyToClipboard } = useCopyToClipboard()
 * await copyToClipboard("https://zap.lk/my-link")
 */
export function useCopyToClipboard(timeout: number = 2000): UseCopyToClipboardReturn {
  const [isCopied, setIsCopied] = React.useState(false)

  const copyToClipboard = React.useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        
        setTimeout(() => {
          setIsCopied(false)
        }, timeout)
      } catch (error) {
        console.error("Failed to copy to clipboard:", error)
        setIsCopied(false)
      }
    },
    [timeout]
  )

  return { isCopied, copyToClipboard }
}

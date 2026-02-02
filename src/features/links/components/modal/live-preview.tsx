"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LinkIcon,
  CopyIcon,
  CheckIcon,
  SmartphoneIcon,
  MonitorIcon,
  GhostIcon,
  UsersIcon,
  TimerIcon,
  EyeIcon,
  CodeIcon,
  InfoIcon,
  LockIcon,
  ShieldIcon,
  FileTextIcon,
  BadgeCheckIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  InterstitialPage,
  hasVariables,
  renderMessageWithValues,
  getVariableStatus,
  type InterstitialConfig,
  type UtmValues,
} from "@/features/interstitial"
import { APP_URL } from "@/utils/app/links"

interface FormValues {
  slug: string
  phone: string
  message: string
  ghostMode: boolean
}

export interface LivePreviewProps {
  /** Basic form values */
  formValues: FormValues
  /** UTM values for variable substitution */
  utmValues?: UtmValues
  /** Interstitial configuration */
  interstitialConfig: InterstitialConfig
  /** Whether there are slug errors */
  hasSlugError: boolean
  /** Whether slug is valid */
  isSlugValid: boolean | null
  /** Classes CSS adicionais */
  className?: string
}

const SECURITY_BADGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ssl: LockIcon,
  privacy: ShieldIcon,
  lgpd: FileTextIcon,
  verified: BadgeCheckIcon,
}

/**
 * Live Preview Component
 * Shows real-time preview of link and interstitial page
 * Memoized to prevent unnecessary re-renders
 */
function LivePreviewComponent({
  formValues,
  utmValues = {},
  interstitialConfig,
  hasSlugError,
  isSlugValid,
  className,
}: LivePreviewProps) {
  const [copied, setCopied] = React.useState(false)
  const [previewTab, setPreviewTab] = React.useState<"link" | "page">("link")
  const [deviceView, setDeviceView] = React.useState<"mobile" | "desktop">("mobile")
  const [showRenderedMessage, setShowRenderedMessage] = React.useState(false)

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(`${APP_URL.toString()}/${formValues.slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [formValues.slug])

  const showLinkPreview = formValues.slug && !hasSlugError && isSlugValid !== false

  // Check if message has variables
  const messageHasVariables = hasVariables(formValues.message)
  const variableStatus = React.useMemo(
    () => getVariableStatus(formValues.message, utmValues),
    [formValues.message, utmValues]
  )

  // Rendered message with UTM values
  const renderedMessage = React.useMemo(
    () =>
      renderMessageWithValues(formValues.message, utmValues, {
        showPlaceholder: true,
      }),
    [formValues.message, utmValues]
  )

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Preview Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>Pré-visualização</span>
        </div>
        {formValues.ghostMode && (
          <Tabs value={previewTab} onValueChange={(v) => setPreviewTab(v as "link" | "page")}>
            <TabsList className="h-8">
              <TabsTrigger value="link" className="h-6 text-xs px-2">
                <LinkIcon className="mr-1 h-3 w-3" />
                Link
              </TabsTrigger>
              <TabsTrigger value="page" className="h-6 text-xs px-2">
                <GhostIcon className="mr-1 h-3 w-3" />
                Página
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      {/* Link Preview */}
      {(!formValues.ghostMode || previewTab === "link") && (
        <div className="flex-1 space-y-4">
          {showLinkPreview ? (
            <>
              {/* Link Card */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                  <LinkIcon className="h-4 w-4" />
                  Seu Link
                </div>
                <div className="flex items-center justify-between gap-2">
                  <code className="flex-1 truncate rounded bg-background px-3 py-2 text-sm">
                    {APP_URL.toString()}/{formValues.slug}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="shrink-0"
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="mr-1.5 h-3.5 w-3.5 text-green-500" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <CopyIcon className="mr-1.5 h-3.5 w-3.5" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Phone preview */}
              {formValues.phone && (
                <div className="rounded-lg border p-3">
                  <p className="mb-1 text-xs text-muted-foreground">Destino</p>
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                      BR
                    </span>
                    +55 {formValues.phone}
                  </p>
                </div>
              )}

              {/* Message preview */}
              {formValues.message && (
                <div className="rounded-lg border p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Mensagem</p>
                    {messageHasVariables && (
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
                          showRenderedMessage
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                        onClick={() => setShowRenderedMessage(!showRenderedMessage)}
                      >
                        {showRenderedMessage ? (
                          <>
                            <EyeIcon className="h-3 w-3" />
                            Valores
                          </>
                        ) : (
                          <>
                            <CodeIcon className="h-3 w-3" />
                            Template
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap line-clamp-4">
                    {showRenderedMessage ? renderedMessage : formValues.message}
                  </p>
                  {messageHasVariables && showRenderedMessage && variableStatus.missing.length > 0 && (
                    <div className="mt-2 flex items-start gap-1.5 rounded bg-muted/50 px-2 py-1.5">
                      <InfoIcon className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Variaveis sem valor: {variableStatus.missing.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Features badges */}
              <div className="flex flex-wrap gap-2">
                {formValues.ghostMode && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    <GhostIcon className="h-3.5 w-3.5" />
                    Ghost Mode
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground">
              <LinkIcon className="mb-2 h-8 w-8 opacity-50" />
              <p className="text-sm">
                Preencha os campos para visualizar seu link
              </p>
            </div>
          )}
        </div>
      )}

      {/* Interstitial Page Preview */}
      {formValues.ghostMode && previewTab === "page" && (
        <div className="flex flex-1 flex-col">
          {/* Device Toggle */}
          <div className="mb-3 flex justify-center">
            <div className="inline-flex rounded-lg border p-0.5">
              <button
                type="button"
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  deviceView === "mobile"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
                onClick={() => setDeviceView("mobile")}
              >
                <SmartphoneIcon className="mr-1 inline h-3.5 w-3.5" />
                Mobile
              </button>
              <button
                type="button"
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  deviceView === "desktop"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
                onClick={() => setDeviceView("desktop")}
              >
                <MonitorIcon className="mr-1 inline h-3.5 w-3.5" />
                Desktop
              </button>
            </div>
          </div>

          {/* Preview Frame - Using real InterstitialPage component */}
          <div className="flex-1 overflow-hidden">
            <div className="flex h-full items-center justify-center rounded-lg border bg-muted/30 p-3">
              <div
                className={cn(
                  "relative overflow-y-auto rounded-lg border-2 shadow-lg transition-all",
                  deviceView === "mobile"
                    ? "h-[480px] w-[260px]"
                    : "h-[360px] w-full max-w-[480px]"
                )}
              >
                <InterstitialPage
                  config={interstitialConfig}
                  isPreview
                  className={cn(
                    "min-h-full w-full",
                    deviceView === "mobile" ? "text-xs" : "text-sm"
                  )}
                />
              </div>
            </div>
          </div>

          {/* Features indicators */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {interstitialConfig.collectName && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                Nome
              </span>
            )}
            {interstitialConfig.collectEmail && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                Email
              </span>
            )}
            {interstitialConfig.countdownEnabled && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                <TimerIcon className="h-3 w-3" />
                Timer
              </span>
            )}
            {interstitialConfig.socialProofEnabled && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300">
                <UsersIcon className="h-3 w-3" />
                Social
              </span>
            )}
            {interstitialConfig.exitIntentEnabled && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                Exit Intent
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export const LivePreview = React.memo(LivePreviewComponent)

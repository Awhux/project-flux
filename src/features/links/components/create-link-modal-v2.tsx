"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LinkIcon,
  Loader2Icon,
  SettingsIcon,
  PaletteIcon,
  GhostIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { BasicFieldsTab } from "./modal/basic-fields-tab"
import { AdvancedFieldsTab } from "./modal/advanced-fields-tab"
import { InterstitialConfigTab } from "./modal/interstitial-config-tab"
import { LivePreview } from "./modal/live-preview"
import { useLinkForm } from "../hooks/use-link-form"
import type { LinkFormData } from "../types"

export interface CreateLinkModalV2Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: LinkFormData) => Promise<void>
}

/**
 * Mobile Preview Card - Compact preview for mobile drawer
 * Memoized to prevent unnecessary re-renders
 */
const MobilePreviewCard = React.memo(function MobilePreviewCard({
  slug,
  hasError,
  ghostMode,
}: {
  slug: string
  hasError: boolean
  ghostMode: boolean
}) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(`https://zap.lk/${slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [slug])

  if (!slug || hasError) {
    return (
      <div className="rounded-xl border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground text-center">
          Preencha o slug para ver o link
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <code className="text-sm truncate">zap.lk/{slug}</code>
        <Button type="button" variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-500" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      {ghostMode && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
          <GhostIcon className="h-3.5 w-3.5" />
          Ghost Mode
        </span>
      )}
    </div>
  )
})

/**
 * Create Link Modal V2 - Horizontal Layout
 * Desktop: Two-column layout with tabs on left, preview on right
 * Mobile: Full-screen drawer with vertical stacking
 * 
 * Uses the useLinkForm hook for stable state management to prevent
 * focus loss and unnecessary re-renders.
 */
export function CreateLinkModalV2({
  open,
  onOpenChange,
  onSubmit,
}: CreateLinkModalV2Props) {
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const [isLoading, setIsLoading] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("basic")

  // Use the form hook for stable state management
  const { formState, validation, handlers } = useLinkForm()

  // Reset form on close
  React.useEffect(() => {
    if (!open) {
      handlers.resetForm()
      setActiveTab("basic")
    }
  }, [open, handlers])

  // Handle form submission
  const handleSubmit = React.useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault()

      const isValid = handlers.validateForm()

      if (!isValid) {
        // Navigate to basic tab if there are errors there
        if (
          validation.errors.slug ||
          validation.errors.phone ||
          validation.errors.message
        ) {
          setActiveTab("basic")
        }
        return
      }

      setIsLoading(true)

      try {
        await onSubmit({
          slug: formState.slug,
          phone: `+55 ${formState.phone}`,
          message: formState.message,
          pixelId: formState.pixelId || undefined,
          capiToken: formState.capiToken || undefined,
          ghostMode: formState.ghostMode,
          // UTM parameters
          utmSource: formState.utmSource || undefined,
          utmMedium: formState.utmMedium || undefined,
          utmCampaign: formState.utmCampaign || undefined,
          utmContent: formState.utmContent || undefined,
          // Interstitial config (only when Ghost Mode is enabled)
          interstitial: formState.ghostMode ? formState.interstitial : undefined,
        })
        onOpenChange(false)
      } catch (error) {
        console.error("Erro ao criar link:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [handlers, validation.errors, formState, onSubmit, onOpenChange]
  )

  // Memoized preview section
  const LinkPreviewSection = React.useMemo(
    () => (
      <div className="flex h-full flex-col rounded-xl border bg-muted/30 p-4 lg:p-6">
        <LivePreview
          formValues={{
            slug: formState.slug,
            phone: formState.phone,
            message: formState.message,
            ghostMode: formState.ghostMode,
          }}
          utmValues={{
            utm_source: formState.utmSource || undefined,
            utm_medium: formState.utmMedium || undefined,
            utm_campaign: formState.utmCampaign || undefined,
            utm_content: formState.utmContent || undefined,
          }}
          interstitialConfig={formState.interstitial}
          hasSlugError={!!validation.errors.slug}
          isSlugValid={validation.isSlugValid}
        />
      </div>
    ),
    [formState, validation.errors.slug, validation.isSlugValid]
  )

  // Memoized form content
  const FormContent = React.useMemo(
    () => (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic" className="gap-2">
            <LinkIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Basico</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Avancado</span>
          </TabsTrigger>
          <TabsTrigger
            value="interstitial"
            className="gap-2"
            disabled={!formState.ghostMode}
          >
            <PaletteIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Pagina</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <BasicFieldsTab
            values={{
              slug: formState.slug,
              phone: formState.phone,
              message: formState.message,
            }}
            errors={validation.errors}
            touched={validation.touched}
            isSlugValid={validation.isSlugValid}
            isCheckingSlug={validation.isSlugChecking}
            onSlugChange={handlers.onSlugChange}
            onPhoneChange={handlers.onPhoneChange}
            onMessageChange={handlers.onMessageChange}
            onFieldBlur={handlers.onFieldBlur}
          />
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <AdvancedFieldsTab
            values={{
              pixelId: formState.pixelId,
              capiToken: formState.capiToken,
              ghostMode: formState.ghostMode,
              utmSource: formState.utmSource,
              utmMedium: formState.utmMedium,
              utmCampaign: formState.utmCampaign,
              utmContent: formState.utmContent,
            }}
            onPixelIdChange={handlers.onPixelIdChange}
            onCapiTokenChange={handlers.onCapiTokenChange}
            onGhostModeChange={handlers.onGhostModeChange}
            onUtmChange={handlers.onUtmChange}
          />
        </TabsContent>

        <TabsContent value="interstitial" className="mt-6">
          {formState.ghostMode ? (
            <InterstitialConfigTab
              values={formState.interstitial}
              onChange={handlers.onInterstitialChange}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PaletteIcon className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Ative o Modo Ghost na aba Avancado para personalizar a pagina de
                captura
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    ),
    [activeTab, formState, validation, handlers]
  )

  // Memoized footer actions
  const FooterActions = React.useMemo(
    () => (
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
          className="flex-1 lg:flex-none"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !validation.isFormValid}
          onClick={() => handleSubmit()}
          className="flex-1 lg:flex-none"
        >
          {isLoading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            "Criar Link"
          )}
        </Button>
      </div>
    ),
    [isLoading, validation.isFormValid, onOpenChange, handleSubmit]
  )

  // Desktop: Dialog with horizontal layout
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] w-300 overflow-hidden p-0">
          <form onSubmit={handleSubmit} className="flex h-full flex-col">
            <DialogHeader className="border-b px-6 py-4">
              <DialogTitle className="text-xl">Criar Novo Link</DialogTitle>
              <DialogDescription>
                Configure um link de rastreamento para sua campanha de WhatsApp
              </DialogDescription>
            </DialogHeader>

            {/* Two-column layout */}
            <div className="grid flex-1 grid-cols-5 overflow-hidden">
              {/* Left column - Form (3/5) */}
              <div className="col-span-3 overflow-y-auto border-r">
                <div className="p-6">{FormContent}</div>
              </div>

              {/* Right column - Preview (2/5) */}
              <div className="col-span-2 overflow-y-auto bg-muted/20 p-6">
                {LinkPreviewSection}
              </div>
            </div>

            <DialogFooter className="border-t px-6 py-4">
              {FooterActions}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  // Mobile: Drawer
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh]">
        <DrawerHeader>
          <DrawerTitle>Criar Novo Link</DrawerTitle>
          <DrawerDescription>
            Configure seu link de rastreamento
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4">
          <form onSubmit={handleSubmit} className="space-y-6 pb-6">
            {/* Collapsed preview on mobile */}
            <MobilePreviewCard
              slug={formState.slug}
              hasError={!!validation.errors.slug}
              ghostMode={formState.ghostMode}
            />

            {FormContent}
          </form>
        </ScrollArea>

        <DrawerFooter>{FooterActions}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

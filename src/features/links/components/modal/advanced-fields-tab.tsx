"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import {
  ChevronDownIcon,
  FacebookIcon,
  GhostIcon,
  TagIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface AdvancedFieldsTabProps {
  /** Current form values */
  values: {
    pixelId: string
    capiToken: string
    ghostMode: boolean
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    utmContent?: string
  }
  /** Handler for pixel ID change */
  onPixelIdChange: (value: string) => void
  /** Handler for CAPI token change */
  onCapiTokenChange: (value: string) => void
  /** Handler for ghost mode toggle */
  onGhostModeChange: (value: boolean) => void
  /** Handler for UTM values */
  onUtmChange?: (field: string, value: string) => void
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Advanced fields tab for Create Link Modal
 * Contains: Facebook Pixel, Ghost Mode, UTM defaults
 * Memoized to prevent unnecessary re-renders
 */
function AdvancedFieldsTabComponent({
  values,
  onPixelIdChange,
  onCapiTokenChange,
  onGhostModeChange,
  onUtmChange,
  className,
}: AdvancedFieldsTabProps) {
  const [pixelOpen, setPixelOpen] = React.useState(false)
  const [utmOpen, setUtmOpen] = React.useState(false)

  return (
    <FieldGroup className={cn("space-y-5", className)}>
      {/* Ghost Mode Toggle */}
      <div className="flex items-center justify-between rounded-xl border bg-muted/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <GhostIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <div className="text-sm font-semibold">Modo Ghost</div>
            <div className="text-xs text-muted-foreground">
              Capture lead antes do redirecionamento para WhatsApp
            </div>
          </div>
        </div>
        <Switch
          checked={values.ghostMode}
          onCheckedChange={onGhostModeChange}
        />
      </div>

      {/* Facebook Pixel Settings */}
      <Collapsible open={pixelOpen} onOpenChange={setPixelOpen}>
        <CollapsibleTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="h-auto w-full justify-between py-3"
            />
          }
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <FacebookIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold">
                Facebook Pixel
              </div>
              <div className="text-xs text-muted-foreground">
                Habilite atribuição server-side
              </div>
            </div>
          </div>
          <ChevronDownIcon
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-200",
              pixelOpen && "rotate-180"
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <Field>
            <FieldLabel htmlFor="pixelId">ID do Facebook Pixel</FieldLabel>
            <Input
              id="pixelId"
              name="pixelId"
              value={values.pixelId}
              onChange={(e) => onPixelIdChange(e.target.value)}
              className="h-10"
              placeholder="123456789012345"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="capiToken">Token da Conversions API</FieldLabel>
            <Input
              id="capiToken"
              name="capiToken"
              type="password"
              value={values.capiToken}
              onChange={(e) => onCapiTokenChange(e.target.value)}
              className="h-10"
              placeholder="Insira seu token CAPI"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              <a
                href="#"
                className="font-medium text-primary hover:underline"
              >
                Saiba como obter seu token CAPI
              </a>
            </p>
          </Field>
        </CollapsibleContent>
      </Collapsible>

      {/* UTM Default Values */}
      {onUtmChange && (
        <Collapsible open={utmOpen} onOpenChange={setUtmOpen}>
          <CollapsibleTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="h-auto w-full justify-between py-3"
              />
            }
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <TagIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">
                  UTM Padrão
                </div>
                <div className="text-xs text-muted-foreground">
                  Valores padrão para parâmetros UTM
                </div>
              </div>
            </div>
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform duration-200",
                utmOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="utmSource">UTM Source</FieldLabel>
                <Input
                  id="utmSource"
                  value={values.utmSource || ""}
                  onChange={(e) => onUtmChange("utmSource", e.target.value)}
                  className="h-10"
                  placeholder="facebook"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="utmMedium">UTM Medium</FieldLabel>
                <Input
                  id="utmMedium"
                  value={values.utmMedium || ""}
                  onChange={(e) => onUtmChange("utmMedium", e.target.value)}
                  className="h-10"
                  placeholder="cpc"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="utmCampaign">UTM Campaign</FieldLabel>
                <Input
                  id="utmCampaign"
                  value={values.utmCampaign || ""}
                  onChange={(e) => onUtmChange("utmCampaign", e.target.value)}
                  className="h-10"
                  placeholder="promo-janeiro"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="utmContent">UTM Content</FieldLabel>
                <Input
                  id="utmContent"
                  value={values.utmContent || ""}
                  onChange={(e) => onUtmChange("utmContent", e.target.value)}
                  className="h-10"
                  placeholder="banner-principal"
                />
              </Field>
            </div>
            <p className="text-xs text-muted-foreground">
              Estes valores serao usados como padrao quando o link nao tiver parametros UTM
            </p>
          </CollapsibleContent>
        </Collapsible>
      )}
    </FieldGroup>
  )
}

export const AdvancedFieldsTab = React.memo(AdvancedFieldsTabComponent)

"use client"

import * as React from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import type { ApiSettings } from "../types"

export interface ApiTabProps {
  /** Configurações de API */
  settings: ApiSettings
  /** Callback ao salvar configurações */
  onSaveSettings: (settings: Partial<ApiSettings>) => void
  /** Callback ao regenerar API key */
  onRegenerateApiKey: () => void
  /** Se está salvando */
  isSaving?: boolean
}

/**
 * Tab de configurações de API
 */
export function ApiTab({
  settings,
  onSaveSettings,
  onRegenerateApiKey,
  isSaving = false,
}: ApiTabProps) {
  const [formData, setFormData] = React.useState({
    defaultPixelId: settings.defaultPixelId,
    defaultCapiToken: settings.defaultCapiToken,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSaveSettings(formData)
  }

  return (
    <TabsContent value="api" className="space-y-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Facebook Pixel</CardTitle>
          <CardDescription>
            Configure as configurações globais do Facebook Pixel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="defaultPixelId">Pixel ID Padrão</FieldLabel>
                <Input
                  id="defaultPixelId"
                  placeholder="123456789012345"
                  value={formData.defaultPixelId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, defaultPixelId: e.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Este pixel será usado em todos os links, a menos que seja sobrescrito
                </p>
              </Field>
              <Field>
                <FieldLabel htmlFor="defaultCapiToken">
                  Token da API de Conversões (CAPI)
                </FieldLabel>
                <Input
                  id="defaultCapiToken"
                  type="password"
                  placeholder="Insira seu token CAPI"
                  value={formData.defaultCapiToken}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, defaultCapiToken: e.target.value }))
                  }
                />
              </Field>
            </FieldGroup>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acesso à API</CardTitle>
          <CardDescription>Gerencie chaves de API e webhooks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium mb-2">Chave de API</p>
              <div className="flex items-center gap-2">
                <Input
                  value={settings.apiKey}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="sm" onClick={onRegenerateApiKey}>
                  Regenerar
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Documentação da API em breve
            </p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}

"use client"

import * as React from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { NotificationToggle } from "./notification-toggle"
import {
  notificationOptions,
  languageOptions,
  timezoneOptions,
} from "../config/settings.config"
import type { NotificationSettings, RegionalSettings } from "../types"

export interface PreferencesTabProps {
  /** Configurações de notificação */
  notifications: NotificationSettings
  /** Configurações regionais */
  regional: RegionalSettings
  /** Callback ao alterar notificação */
  onNotificationChange: (key: keyof NotificationSettings, value: boolean) => void
  /** Callback ao salvar preferências regionais */
  onRegionalSave: (settings: RegionalSettings) => void
  /** Se está salvando */
  isSaving?: boolean
}

/**
 * Tab de preferências (notificações e regional)
 */
export function PreferencesTab({
  notifications,
  regional,
  onNotificationChange,
  onRegionalSave,
  isSaving = false,
}: PreferencesTabProps) {
  const [regionalForm, setRegionalForm] = React.useState<RegionalSettings>(regional)

  const handleRegionalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRegionalSave(regionalForm)
  }

  return (
    <TabsContent value="preferences" className="space-y-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>
            Escolha como você deseja receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationOptions.map((option, index) => (
            <React.Fragment key={option.id}>
              <NotificationToggle
                id={option.id}
                title={option.title}
                description={option.description}
                checked={notifications[option.id as keyof NotificationSettings]}
                onCheckedChange={(checked) =>
                  onNotificationChange(option.id as keyof NotificationSettings, checked)
                }
              />
              {index < notificationOptions.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Regionais</CardTitle>
          <CardDescription>Defina seu idioma e fuso horário</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegionalSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="language">Idioma</FieldLabel>
                <Select
                  value={regionalForm.language}
                  onValueChange={(value) =>
                    setRegionalForm((prev) => ({ ...prev, language: value }))
                  }
                  items={languageOptions}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="timezone">Fuso Horário</FieldLabel>
                <Select
                  value={regionalForm.timezone}
                  onValueChange={(value) =>
                    setRegionalForm((prev) => ({ ...prev, timezone: value }))
                  }
                  items={timezoneOptions}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezoneOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Preferências"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </TabsContent>
  )
}

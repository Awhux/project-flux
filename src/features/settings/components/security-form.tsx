"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import type { PasswordChangeData } from "../types"

export interface SecurityFormProps {
  /** Callback ao atualizar senha */
  onPasswordChange: (data: PasswordChangeData) => void
  /** Se está processando */
  isUpdating?: boolean
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Formulário de segurança (alteração de senha)
 */
export function SecurityForm({
  onPasswordChange,
  isUpdating = false,
  className,
}: SecurityFormProps) {
  const [formData, setFormData] = React.useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPasswordChange(formData)
    // Reset form after submit
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleChange = (field: keyof PasswordChangeData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid =
    formData.currentPassword &&
    formData.newPassword &&
    formData.confirmPassword &&
    formData.newPassword === formData.confirmPassword

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Segurança</CardTitle>
        <CardDescription>
          Gerencie sua senha e configurações de segurança
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="currentPassword">Senha Atual</FieldLabel>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => handleChange("currentPassword", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newPassword">Nova Senha</FieldLabel>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirmar Nova Senha</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
              />
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="text-xs text-destructive mt-1">
                  As senhas não coincidem
                </p>
              )}
            </Field>
          </FieldGroup>

          <div className="flex justify-end">
            <Button type="submit" disabled={!isFormValid || isUpdating}>
              {isUpdating ? "Atualizando..." : "Atualizar Senha"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

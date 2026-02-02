"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import {
  CheckCircleIcon,
  AlertCircleIcon,
  Loader2Icon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { normalizeSlug } from "../../utils/validate-slug"
import { formatPhoneNumber } from "../../utils/format-phone"
import { SLUG_MAX_LENGTH, MESSAGE_MAX_LENGTH, utmVariables } from "../../config"
import { APP_URL } from "@/utils/app/links"

interface FormErrors {
  slug?: string
  phone?: string
  message?: string
}

export interface BasicFieldsTabProps {
  /** Current form values */
  values: {
    slug: string
    phone: string
    message: string
  }
  /** Form errors */
  errors: FormErrors
  /** Touched fields */
  touched: Record<string, boolean>
  /** Whether slug is valid (unique) */
  isSlugValid: boolean | null
  /** Whether checking slug */
  isCheckingSlug: boolean
  /** Handler for slug change */
  onSlugChange: (value: string) => void
  /** Handler for phone change */
  onPhoneChange: (value: string) => void
  /** Handler for message change */
  onMessageChange: (value: string) => void
  /** Handler for field blur */
  onFieldBlur: (field: string) => void
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Basic fields tab for Create Link Modal
 * Contains: Slug, Phone, Message
 * Memoized to prevent unnecessary re-renders
 */
function BasicFieldsTabComponent({
  values,
  errors,
  touched,
  isSlugValid,
  isCheckingSlug,
  onSlugChange,
  onPhoneChange,
  onMessageChange,
  onFieldBlur,
  className,
}: BasicFieldsTabProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = normalizeSlug(e.target.value)
    onSlugChange(value)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d\s()-]/g, "")
    const formatted = formatPhoneNumber(value)
    onPhoneChange(formatted)
  }

  // Insert UTM variable at cursor position
  const insertVariable = (variable: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const before = values.message.substring(0, start)
      const after = values.message.substring(end)
      const newMessage = before + variable + after
      onMessageChange(newMessage)

      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length
        textarea.focus()
      }, 0)
    }
  }

  return (
    <FieldGroup className={cn("space-y-5", className)}>
      {/* Slug Input */}
      <Field>
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="slug">
            Slug do Link <span className="text-destructive">*</span>
          </FieldLabel>
          <span
            className={cn(
              "text-xs",
              values.slug.length > SLUG_MAX_LENGTH
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            {values.slug.length}/{SLUG_MAX_LENGTH}
          </span>
        </div>
        <div className="flex items-center">
          <span className="inline-flex h-10 items-center rounded-l-lg border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
            {APP_URL.host}/
          </span>
          <div className="relative flex-1">
            <Input
              id="slug"
              name="slug"
              value={values.slug}
              onChange={handleSlugChange}
              onBlur={() => onFieldBlur("slug")}
              className={cn(
                "h-10 rounded-l-none pr-10",
                touched.slug && errors.slug && "border-destructive focus-visible:ring-destructive"
              )}
              placeholder="minha-promo"
              required
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCheckingSlug && (
                <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {!isCheckingSlug && isSlugValid === true && (
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              )}
              {!isCheckingSlug && isSlugValid === false && (
                <AlertCircleIcon className="h-4 w-4 text-destructive" />
              )}
            </div>
          </div>
        </div>
        {touched.slug && errors.slug ? (
          <p className="mt-1.5 text-xs text-destructive">{errors.slug}</p>
        ) : (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Use apenas letras minúsculas, números e hífens
          </p>
        )}
      </Field>

      {/* WhatsApp Number */}
      <Field>
        <FieldLabel htmlFor="phone">
          Numero do WhatsApp <span className="text-destructive">*</span>
        </FieldLabel>
        <div className="relative">
          <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
            <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
              BR
            </span>
            <span className="text-sm text-muted-foreground">+55</span>
          </div>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handlePhoneChange}
            onBlur={() => onFieldBlur("phone")}
            className={cn(
              "h-10 pl-18",
              touched.phone && errors.phone && "border-destructive focus-visible:ring-destructive"
            )}
            placeholder="(11) 99999-9999"
            required
          />
        </div>
        {touched.phone && errors.phone ? (
          <p className="mt-1.5 text-xs text-destructive">{errors.phone}</p>
        ) : (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Formato: (DD) 9XXXX-XXXX
          </p>
        )}
      </Field>

      {/* Message Template */}
      <Field>
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="message">
            Modelo de Mensagem <span className="text-destructive">*</span>
          </FieldLabel>
          <span
            className={cn(
              "text-xs",
              values.message.length > MESSAGE_MAX_LENGTH
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            {values.message.length}/{MESSAGE_MAX_LENGTH}
          </span>
        </div>
        <Textarea
          ref={textareaRef}
          id="message"
          name="message"
          value={values.message}
          onChange={(e) => onMessageChange(e.target.value)}
          onBlur={() => onFieldBlur("message")}
          rows={4}
          className={cn(
            "resize-none",
            touched.message && errors.message && "border-destructive focus-visible:ring-destructive"
          )}
          placeholder="Olá! Vi o anúncio sobre {{utm_campaign}} e gostaria de saber mais."
          required
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {utmVariables.map((variable) => (
            <Button
              key={variable}
              type="button"
              variant="outline"
              size="xs"
              onClick={() => insertVariable(variable)}
              className="text-xs"
            >
              {variable.replace(/[{}]/g, "")}
            </Button>
          ))}
        </div>
        {touched.message && errors.message ? (
          <p className="mt-1.5 text-xs text-destructive">{errors.message}</p>
        ) : (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Clique nas variaveis acima para inseri-las na mensagem
          </p>
        )}
      </Field>
    </FieldGroup>
  )
}

export const BasicFieldsTab = React.memo(BasicFieldsTabComponent)

"use client"

import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MESSAGE_MAX_LENGTH, utmVariables } from "../../config/links.config"

export interface MessageFieldProps {
  /** Current message value */
  value: string
  /** Error message */
  error?: string
  /** Whether field has been touched */
  touched?: boolean
  /** Called when message changes */
  onChange: (value: string) => void
  /** Called when field loses focus */
  onBlur?: () => void
  /** Whether field is disabled */
  disabled?: boolean
  /** Number of rows for textarea */
  rows?: number
  /** Additional class names */
  className?: string
}

/**
 * Reusable message template field component
 * 
 * Features:
 * - Character counter
 * - UTM variable insertion buttons
 * - Cursor position preserved on variable insert
 */
export const MessageField = React.memo(function MessageField({
  value,
  error,
  touched,
  onChange,
  onBlur,
  disabled,
  rows = 4,
  className,
}: MessageFieldProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const insertVariable = React.useCallback(
    (variable: string) => {
      if (!textareaRef.current) return

      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const before = value.substring(0, start)
      const after = value.substring(end)
      const newMessage = before + variable + after
      onChange(newMessage)

      // Restore cursor position after inserted text
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length
        textarea.focus()
      }, 0)
    },
    [value, onChange]
  )

  const showError = touched && error
  const isOverLimit = value.length > MESSAGE_MAX_LENGTH

  return (
    <Field className={className}>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor="message">
          Modelo de Mensagem <span className="text-destructive">*</span>
        </FieldLabel>
        <span
          className={cn(
            "text-xs",
            isOverLimit ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {value.length}/{MESSAGE_MAX_LENGTH}
        </span>
      </div>
      <Textarea
        ref={textareaRef}
        id="message"
        name="message"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        rows={rows}
        className={cn(
          "resize-none",
          showError && "border-destructive focus-visible:ring-destructive"
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
            size="sm"
            onClick={() => insertVariable(variable)}
            disabled={disabled}
            className="h-7 px-2 text-xs"
          >
            {variable.replace(/[{}]/g, "")}
          </Button>
        ))}
      </div>
      {showError ? (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      ) : (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Clique nas variáveis acima para inseri-las na mensagem
        </p>
      )}
    </Field>
  )
})

MessageField.displayName = "MessageField"

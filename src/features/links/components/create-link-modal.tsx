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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ChevronDownIcon,
  FacebookIcon,
  GhostIcon,
  LinkIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  Loader2Icon,
  CopyIcon,
  CheckIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { validateSlug, normalizeSlug } from "../utils/validate-slug"
import { formatPhoneNumber, getPhoneError } from "../utils/format-phone"
import { SLUG_MAX_LENGTH, MESSAGE_MAX_LENGTH, utmVariables } from "../config"
import type { LinkFormData } from "../types"

export interface CreateLinkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: LinkFormData) => Promise<void>
}

interface FormErrors {
  slug?: string
  phone?: string
  message?: string
}

/**
 * Modal para criar um novo link
 */
export function CreateLinkModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateLinkModalProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [ghostMode, setGhostMode] = React.useState(false)
  const [pixelOpen, setPixelOpen] = React.useState(false)

  // Form state
  const [slug, setSlug] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [pixelId, setPixelId] = React.useState("")
  const [capiToken, setCapiToken] = React.useState("")

  // Validation state
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})
  const [isSlugValid, setIsSlugValid] = React.useState<boolean | null>(null)
  const [isCheckingSlug, setIsCheckingSlug] = React.useState(false)

  // Copy state for preview
  const [copied, setCopied] = React.useState(false)

  // Reset form on close
  React.useEffect(() => {
    if (!open) {
      setSlug("")
      setPhone("")
      setMessage("")
      setPixelId("")
      setCapiToken("")
      setGhostMode(false)
      setPixelOpen(false)
      setErrors({})
      setTouched({})
      setIsSlugValid(null)
    }
  }, [open])

  // Validate message
  const validateMessage = (value: string): string | undefined => {
    if (!value) return "Mensagem é obrigatória"
    if (value.length > MESSAGE_MAX_LENGTH)
      return `Mensagem deve ter menos de ${MESSAGE_MAX_LENGTH} caracteres`
    return undefined
  }

  // Handle slug change with debounced uniqueness check
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = normalizeSlug(e.target.value)
    setSlug(value)
    setErrors((prev) => ({ ...prev, slug: validateSlug(value) }))

    if (value && !validateSlug(value)) {
      setIsCheckingSlug(true)
      setIsSlugValid(null)
      setTimeout(() => {
        const isAvailable = !["test", "admin", "api"].includes(value)
        setIsSlugValid(isAvailable)
        setIsCheckingSlug(false)
        if (!isAvailable) {
          setErrors((prev) => ({ ...prev, slug: "Este slug já está em uso" }))
        }
      }, 500)
    } else {
      setIsSlugValid(null)
    }
  }

  // Handle phone change with formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d\s()-]/g, "")
    const formatted = formatPhoneNumber(value)
    setPhone(formatted)
    setErrors((prev) => ({ ...prev, phone: getPhoneError(formatted) }))
  }

  // Handle message change
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)
    setErrors((prev) => ({ ...prev, message: validateMessage(value) }))
  }

  // Insert variable into message
  const insertVariable = (variable: string) => {
    const textarea = document.getElementById("message") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const before = message.substring(0, start)
      const after = message.substring(end)
      const newMessage = before + variable + after
      setMessage(newMessage)
      setErrors((prev) => ({ ...prev, message: validateMessage(newMessage) }))

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length
        textarea.focus()
      }, 0)
    }
  }

  // Copy preview link to clipboard
  const handleCopyPreview = async () => {
    await navigator.clipboard.writeText(`https://zap.lk/${slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newErrors: FormErrors = {
      slug: validateSlug(slug),
      phone: getPhoneError(phone),
      message: validateMessage(message),
    }

    if (!newErrors.slug && isSlugValid === false) {
      newErrors.slug = "Este slug já está em uso"
    }

    setErrors(newErrors)
    setTouched({ slug: true, phone: true, message: true })

    if (Object.values(newErrors).some(Boolean)) {
      return
    }

    setIsLoading(true)

    try {
      await onSubmit({
        slug,
        phone: `+55 ${phone}`,
        message,
        pixelId: pixelId || undefined,
        capiToken: capiToken || undefined,
        ghostMode,
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao criar link:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid =
    !errors.slug &&
    !errors.phone &&
    !errors.message &&
    slug &&
    phone &&
    message &&
    isSlugValid !== false

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Criar Novo Link</DialogTitle>
          <DialogDescription>
            Configure um link de rastreamento para sua campanha de WhatsApp
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup className="space-y-5">
            {/* Slug Input */}
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="slug">
                  Slug do Link <span className="text-destructive">*</span>
                </FieldLabel>
                <span
                  className={cn(
                    "text-xs",
                    slug.length > SLUG_MAX_LENGTH
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  {slug.length}/{SLUG_MAX_LENGTH}
                </span>
              </div>
              <div className="flex items-center">
                <span className="inline-flex h-10 items-center rounded-l-lg border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                  zap.lk/
                </span>
                <div className="relative flex-1">
                  <Input
                    id="slug"
                    name="slug"
                    value={slug}
                    onChange={handleSlugChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, slug: true }))}
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
                Número do WhatsApp <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                  <span className="text-lg">🇧🇷</span>
                  <span className="text-sm text-muted-foreground">+55</span>
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                  className={cn(
                    "h-10 pl-20",
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
                    message.length > MESSAGE_MAX_LENGTH
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  {message.length}/{MESSAGE_MAX_LENGTH}
                </span>
              </div>
              <Textarea
                id="message"
                name="message"
                value={message}
                onChange={handleMessageChange}
                onBlur={() => setTouched((prev) => ({ ...prev, message: true }))}
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
                  Clique nas variáveis acima para inseri-las na mensagem
                </p>
              )}
            </Field>

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
                      Facebook Pixel (Opcional)
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
                    value={pixelId}
                    onChange={(e) => setPixelId(e.target.value)}
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
                    value={capiToken}
                    onChange={(e) => setCapiToken(e.target.value)}
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

            {/* Ghost Mode Toggle */}
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <GhostIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Modo Ghost</div>
                  <div className="text-xs text-muted-foreground">
                    Capture lead antes do redirecionamento
                  </div>
                </div>
              </div>
              <Switch checked={ghostMode} onCheckedChange={setGhostMode} />
            </div>

            {/* Link Preview */}
            {slug && !errors.slug && isSlugValid !== false && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                  <LinkIcon className="h-4 w-4" />
                  Pré-visualização do Link
                </div>
                <div className="flex items-center justify-between gap-2">
                  <code className="flex-1 rounded bg-background px-3 py-2 text-sm">
                    https://zap.lk/{slug}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPreview}
                    className="shrink-0"
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="mr-1.5 h-3.5 w-3.5 text-green-500" />
                        Copiado!
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
            )}
          </FieldGroup>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !isFormValid}>
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Link"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

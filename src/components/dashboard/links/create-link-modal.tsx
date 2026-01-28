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
import { formatPhoneNumber, validatePhoneNumber } from "@/lib/phone"

interface CreateLinkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
}

interface FormErrors {
  slug?: string
  phone?: string
  message?: string
}

const SLUG_MIN_LENGTH = 3
const SLUG_MAX_LENGTH = 50
const MESSAGE_MAX_LENGTH = 500

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

  // Validate slug format
  const validateSlug = (value: string): string | undefined => {
    if (!value) return "Slug is required"
    if (value.length < SLUG_MIN_LENGTH)
      return `Slug must be at least ${SLUG_MIN_LENGTH} characters`
    if (value.length > SLUG_MAX_LENGTH)
      return `Slug must be less than ${SLUG_MAX_LENGTH} characters`
    if (!/^[a-z0-9-]+$/.test(value))
      return "Only lowercase letters, numbers, and hyphens allowed"
    if (value.startsWith("-") || value.endsWith("-"))
      return "Slug cannot start or end with a hyphen"
    return undefined
  }

  // Validate phone
  const validatePhone = (value: string): string | undefined => {
    if (!value) return "Phone number is required"
    if (!validatePhoneNumber(value)) return "Please enter a valid phone number"
    return undefined
  }

  // Validate message
  const validateMessage = (value: string): string | undefined => {
    if (!value) return "Message is required"
    if (value.length > MESSAGE_MAX_LENGTH)
      return `Message must be less than ${MESSAGE_MAX_LENGTH} characters`
    return undefined
  }

  // Handle slug change with debounced uniqueness check
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
    setSlug(value)
    setErrors((prev) => ({ ...prev, slug: validateSlug(value) }))

    // Simulate checking slug availability
    if (value && !validateSlug(value)) {
      setIsCheckingSlug(true)
      setIsSlugValid(null)
      setTimeout(() => {
        // Simulate API response - in real app this would check against database
        const isAvailable = !["test", "admin", "api"].includes(value)
        setIsSlugValid(isAvailable)
        setIsCheckingSlug(false)
        if (!isAvailable) {
          setErrors((prev) => ({ ...prev, slug: "This slug is already taken" }))
        }
      }, 500)
    } else {
      setIsSlugValid(null)
    }
  }

  // Handle phone change with formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers, parentheses, hyphens, and spaces
    const cleaned = value.replace(/[^\d\s()-]/g, "")

    // Auto-format as user types
    const digits = cleaned.replace(/\D/g, "")
    let formatted = ""

    if (digits.length > 0) {
      if (digits.length <= 2) {
        formatted = `(${digits}`
      } else if (digits.length <= 7) {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`
      } else {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
      }
    }

    setPhone(formatted)
    setErrors((prev) => ({ ...prev, phone: validatePhone(formatted) }))
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

      // Restore cursor position after state update
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          start + variable.length
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

    // Validate all fields
    const newErrors: FormErrors = {
      slug: validateSlug(slug),
      phone: validatePhone(phone),
      message: validateMessage(message),
    }

    // Also check if slug is available
    if (!newErrors.slug && isSlugValid === false) {
      newErrors.slug = "This slug is already taken"
    }

    setErrors(newErrors)
    setTouched({ slug: true, phone: true, message: true })

    // If there are errors, don't submit
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
      console.error("Error creating link:", error)
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
          <DialogTitle className="text-xl">Create New Link</DialogTitle>
          <DialogDescription>
            Set up a tracking link for your WhatsApp marketing campaign
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup className="space-y-5">
            {/* Slug Input */}
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="slug">
                  Link Slug <span className="text-red-500">*</span>
                </FieldLabel>
                <span
                  className={cn(
                    "text-xs",
                    slug.length > SLUG_MAX_LENGTH
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  {slug.length}/{SLUG_MAX_LENGTH}
                </span>
              </div>
              <div className="flex items-center">
                <span className="inline-flex h-10 items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 px-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
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
                      touched.slug &&
                      errors.slug &&
                      "border-red-500 focus-visible:ring-red-500"
                    )}
                    placeholder="my-promo"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isCheckingSlug && (
                      <Loader2Icon className="h-4 w-4 animate-spin text-gray-400" />
                    )}
                    {!isCheckingSlug && isSlugValid === true && (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    )}
                    {!isCheckingSlug && isSlugValid === false && (
                      <AlertCircleIcon className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
              {touched.slug && errors.slug ? (
                <p className="mt-1.5 text-xs text-red-500">{errors.slug}</p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-500">
                  Use lowercase letters, numbers, and hyphens only
                </p>
              )}
            </Field>

            {/* WhatsApp Number */}
            <Field>
              <FieldLabel htmlFor="phone">
                WhatsApp Number <span className="text-red-500">*</span>
              </FieldLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                  <span className="text-lg">🇧🇷</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    +55
                  </span>
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
                    touched.phone &&
                    errors.phone &&
                    "border-red-500 focus-visible:ring-red-500"
                  )}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              {touched.phone && errors.phone ? (
                <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-500">
                  Format: (DD) 9XXXX-XXXX
                </p>
              )}
            </Field>

            {/* Message Template */}
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="message">
                  WhatsApp Message Template{" "}
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <span
                  className={cn(
                    "text-xs",
                    message.length > MESSAGE_MAX_LENGTH
                      ? "text-red-500"
                      : "text-gray-500"
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
                  touched.message &&
                  errors.message &&
                  "border-red-500 focus-visible:ring-red-500"
                )}
                placeholder="Olá! Vi o anúncio sobre {{utm_campaign}} e gostaria de saber mais."
                required
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {["{{utm_source}}", "{{utm_campaign}}", "{{utm_content}}", "{{utm_medium}}"].map(
                  (variable) => (
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
                  )
                )}
              </div>
              {touched.message && errors.message ? (
                <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-500">
                  Click variables above to insert them into your message
                </p>
              )}
            </Field>

            {/* Facebook Pixel Settings (Collapsible) */}
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
                      Facebook Pixel (Optional)
                    </div>
                    <div className="text-xs text-gray-500">
                      Enable server-side attribution
                    </div>
                  </div>
                </div>
                <ChevronDownIcon
                  className={cn(
                    "h-5 w-5 text-gray-400 transition-transform duration-200",
                    pixelOpen && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                <Field>
                  <FieldLabel htmlFor="pixelId">Facebook Pixel ID</FieldLabel>
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
                  <FieldLabel htmlFor="capiToken">
                    Conversions API Token
                  </FieldLabel>
                  <Input
                    id="capiToken"
                    name="capiToken"
                    type="password"
                    value={capiToken}
                    onChange={(e) => setCapiToken(e.target.value)}
                    className="h-10"
                    placeholder="Enter your CAPI token"
                  />
                  <p className="mt-1.5 text-xs text-gray-500">
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      Learn how to get your CAPI token
                    </a>
                  </p>
                </Field>
              </CollapsibleContent>
            </Collapsible>

            {/* Ghost Mode Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <GhostIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Ghost Mode
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Capture lead before WhatsApp redirect
                  </div>
                </div>
              </div>
              <Switch checked={ghostMode} onCheckedChange={setGhostMode} />
            </div>

            {/* Link Preview */}
            {slug && !errors.slug && isSlugValid !== false && (
              <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-900/20">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  <LinkIcon className="h-4 w-4" />
                  Link Preview
                </div>
                <div className="flex items-center justify-between gap-2">
                  <code className="flex-1 rounded bg-white px-3 py-2 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">
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
                        Copied!
                      </>
                    ) : (
                      <>
                        <CopyIcon className="mr-1.5 h-3.5 w-3.5" />
                        Copy
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
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !isFormValid}>
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Link"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

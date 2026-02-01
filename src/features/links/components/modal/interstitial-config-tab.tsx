"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronDownIcon,
  ImageIcon,
  FormInputIcon,
  TimerIcon,
  UsersIcon,
  DoorOpenIcon,
  ShieldCheckIcon,
  CodeIcon,
  PaletteIcon,
  SunIcon,
  MoonIcon,
  StarIcon,
  PlusIcon,
  TrashIcon,
  LockIcon,
  ShieldIcon,
  FileTextIcon,
  BadgeCheckIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types for interstitial configuration
export interface InterstitialConfig {
  // Visual customization
  logo?: string
  headline: string
  description: string
  buttonText: string
  bgColor: string
  bgImage?: string
  bgOverlayOpacity: number
  theme: "light" | "dark"

  // Form fields
  collectName: boolean
  nameRequired: boolean
  collectEmail: boolean
  emailRequired: boolean
  phoneLabel: string
  privacyPolicyUrl: string
  privacyCheckboxText: string

  // Advanced features
  customCss: string
  countdownEnabled: boolean
  countdownSeconds: number
  countdownRedirectUrl: string
  socialProofEnabled: boolean
  socialProofCount: number
  socialProofText: string
  exitIntentEnabled: boolean
  exitIntentMessage: string
  exitIntentOfferText: string

  // Trust elements
  securityBadges: string[]
  testimonials: Array<{
    text: string
    author: string
    rating: number
  }>
}

export interface InterstitialConfigTabProps {
  /** Current configuration values */
  values: InterstitialConfig
  /** Handler for configuration changes */
  onChange: (config: Partial<InterstitialConfig>) => void
  /** Classes CSS adicionais */
  className?: string
}

const SECURITY_BADGES = [
  { id: "ssl", label: "SSL Seguro", Icon: LockIcon },
  { id: "privacy", label: "Privacidade", Icon: ShieldIcon },
  { id: "lgpd", label: "LGPD", Icon: FileTextIcon },
  { id: "verified", label: "Verificado", Icon: BadgeCheckIcon },
] as const

const DEFAULT_COLORS = [
  "#4F46E5", // Primary indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#1F2937", // Gray dark
]

/**
 * Star Rating Component
 */
function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={cn(
            "h-3 w-3",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </span>
  )
}

/**
 * Interstitial Configuration Tab
 * Contains all customization options for the Ghost Mode interstitial page
 * Memoized to prevent unnecessary re-renders
 */
function InterstitialConfigTabComponent({
  values,
  onChange,
  className,
}: InterstitialConfigTabProps) {
  const [visualOpen, setVisualOpen] = React.useState(true)
  const [formFieldsOpen, setFormFieldsOpen] = React.useState(false)
  const [advancedOpen, setAdvancedOpen] = React.useState(false)
  const [trustOpen, setTrustOpen] = React.useState(false)

  const handleChange = <K extends keyof InterstitialConfig>(
    key: K,
    value: InterstitialConfig[K]
  ) => {
    onChange({ [key]: value })
  }

  const addTestimonial = () => {
    const newTestimonial = { text: "", author: "", rating: 5 }
    onChange({
      testimonials: [...values.testimonials, newTestimonial],
    })
  }

  const updateTestimonial = (
    index: number,
    field: "text" | "author" | "rating",
    value: string | number
  ) => {
    const updated = [...values.testimonials]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ testimonials: updated })
  }

  const removeTestimonial = (index: number) => {
    onChange({
      testimonials: values.testimonials.filter((_, i) => i !== index),
    })
  }

  const toggleBadge = (badgeId: string) => {
    const current = values.securityBadges
    const updated = current.includes(badgeId)
      ? current.filter((id) => id !== badgeId)
      : [...current, badgeId]
    onChange({ securityBadges: updated })
  }

  return (
    <ScrollArea className={cn("max-h-[500px] pr-3", className)}>
      <div className="space-y-4">
        {/* Visual Customization Section */}
        <Collapsible open={visualOpen} onOpenChange={setVisualOpen}>
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <PaletteIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Personalização Visual</div>
                <div className="text-xs text-muted-foreground">
                  Logo, cores, textos e tema
                </div>
              </div>
            </div>
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform duration-200",
                visualOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <FieldGroup className="space-y-4">
              {/* Logo Upload */}
              <Field>
                <FieldLabel>Logo da Página</FieldLabel>
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                    {values.logo ? (
                      <img
                        src={values.logo}
                        alt="Logo"
                        className="h-full w-full rounded-lg object-contain"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="URL da imagem ou faça upload"
                      value={values.logo || ""}
                      onChange={(e) => handleChange("logo", e.target.value)}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Recomendado: 200x60px, PNG transparente
                    </p>
                  </div>
                </div>
              </Field>

              {/* Headline */}
              <Field>
                <FieldLabel>Título Principal</FieldLabel>
                <Input
                  value={values.headline}
                  onChange={(e) => handleChange("headline", e.target.value)}
                  placeholder="Para acessar o desconto, confirme seu WhatsApp"
                />
              </Field>

              {/* Description */}
              <Field>
                <FieldLabel>Descrição</FieldLabel>
                <Textarea
                  value={values.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Isso leva apenas 5 segundos"
                  rows={2}
                />
              </Field>

              {/* Button Text */}
              <Field>
                <FieldLabel>Texto do Botão</FieldLabel>
                <Input
                  value={values.buttonText}
                  onChange={(e) => handleChange("buttonText", e.target.value)}
                  placeholder="Continuar para WhatsApp"
                />
              </Field>

              {/* Background Color */}
              <Field>
                <FieldLabel>Cor de Fundo</FieldLabel>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {DEFAULT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={cn(
                          "h-8 w-8 rounded-lg border-2 transition-all",
                          values.bgColor === color
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-transparent hover:border-muted-foreground/30"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => handleChange("bgColor", color)}
                      />
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={values.bgColor}
                    onChange={(e) => handleChange("bgColor", e.target.value)}
                    className="h-8 w-14 cursor-pointer p-1"
                  />
                </div>
              </Field>

              {/* Background Image */}
              <Field>
                <FieldLabel>Imagem de Fundo (Opcional)</FieldLabel>
                <Input
                  value={values.bgImage || ""}
                  onChange={(e) => handleChange("bgImage", e.target.value)}
                  placeholder="URL da imagem de fundo"
                />
                {values.bgImage && (
                  <div className="mt-2 space-y-2">
                    <FieldLabel>Opacidade do Overlay</FieldLabel>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={values.bgOverlayOpacity}
                      onChange={(e) =>
                        handleChange("bgOverlayOpacity", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">
                      {values.bgOverlayOpacity}%
                    </span>
                  </div>
                )}
              </Field>

              {/* Theme Toggle */}
              <Field>
                <FieldLabel>Tema</FieldLabel>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={values.theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleChange("theme", "light")}
                    className="flex-1"
                  >
                    <SunIcon className="mr-2 h-4 w-4" />
                    Claro
                  </Button>
                  <Button
                    type="button"
                    variant={values.theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleChange("theme", "dark")}
                    className="flex-1"
                  >
                    <MoonIcon className="mr-2 h-4 w-4" />
                    Escuro
                  </Button>
                </div>
              </Field>
            </FieldGroup>
          </CollapsibleContent>
        </Collapsible>

        {/* Form Fields Section */}
        <Collapsible open={formFieldsOpen} onOpenChange={setFormFieldsOpen}>
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
                <FormInputIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Campos do Formulário</div>
                <div className="text-xs text-muted-foreground">
                  Configure quais dados coletar
                </div>
              </div>
            </div>
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform duration-200",
                formFieldsOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <FieldGroup className="space-y-4">
              {/* Name Field */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={values.collectName}
                    onCheckedChange={(checked) =>
                      handleChange("collectName", checked)
                    }
                  />
                  <div>
                    <p className="text-sm font-medium">Campo Nome</p>
                    <p className="text-xs text-muted-foreground">
                      Coletar nome do visitante
                    </p>
                  </div>
                </div>
                {values.collectName && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Obrigatório
                    </span>
                    <Switch
                      checked={values.nameRequired}
                      onCheckedChange={(checked) =>
                        handleChange("nameRequired", checked)
                      }
                    />
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={values.collectEmail}
                    onCheckedChange={(checked) =>
                      handleChange("collectEmail", checked)
                    }
                  />
                  <div>
                    <p className="text-sm font-medium">Campo Email</p>
                    <p className="text-xs text-muted-foreground">
                      Coletar email do visitante
                    </p>
                  </div>
                </div>
                {values.collectEmail && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Obrigatório
                    </span>
                    <Switch
                      checked={values.emailRequired}
                      onCheckedChange={(checked) =>
                        handleChange("emailRequired", checked)
                      }
                    />
                  </div>
                )}
              </div>

              {/* Phone Label */}
              <Field>
                <FieldLabel>Label do Campo Telefone</FieldLabel>
                <Input
                  value={values.phoneLabel}
                  onChange={(e) => handleChange("phoneLabel", e.target.value)}
                  placeholder="WhatsApp"
                />
              </Field>

              {/* Privacy Policy */}
              <Field>
                <FieldLabel>URL da Política de Privacidade</FieldLabel>
                <Input
                  value={values.privacyPolicyUrl}
                  onChange={(e) =>
                    handleChange("privacyPolicyUrl", e.target.value)
                  }
                  placeholder="https://seusite.com/privacidade"
                />
              </Field>

              <Field>
                <FieldLabel>Texto do Checkbox de Privacidade</FieldLabel>
                <Input
                  value={values.privacyCheckboxText}
                  onChange={(e) =>
                    handleChange("privacyCheckboxText", e.target.value)
                  }
                  placeholder="Aceito receber mensagens no WhatsApp"
                />
              </Field>
            </FieldGroup>
          </CollapsibleContent>
        </Collapsible>

        {/* Advanced Features Section */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <CodeIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Recursos Avançados</div>
                <div className="text-xs text-muted-foreground">
                  CSS, timer, prova social, exit intent
                </div>
              </div>
            </div>
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform duration-200",
                advancedOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <FieldGroup className="space-y-4">
              {/* Custom CSS */}
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <CodeIcon className="h-4 w-4" />
                  CSS Personalizado
                </FieldLabel>
                <Textarea
                  value={values.customCss}
                  onChange={(e) => handleChange("customCss", e.target.value)}
                  placeholder=".container { }&#10;.button { }"
                  rows={4}
                  className="font-mono text-xs"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  CSS avançado para customização completa
                </p>
              </Field>

              {/* Countdown Timer */}
              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TimerIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Timer de Contagem</p>
                      <p className="text-xs text-muted-foreground">
                        Redireciona após tempo limite
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={values.countdownEnabled}
                    onCheckedChange={(checked) =>
                      handleChange("countdownEnabled", checked)
                    }
                  />
                </div>
                {values.countdownEnabled && (
                  <div className="grid gap-3 pt-2 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>Segundos</FieldLabel>
                      <Input
                        type="number"
                        min={5}
                        max={300}
                        value={values.countdownSeconds}
                        onChange={(e) =>
                          handleChange("countdownSeconds", Number(e.target.value))
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel>URL de Redirecionamento</FieldLabel>
                      <Input
                        value={values.countdownRedirectUrl}
                        onChange={(e) =>
                          handleChange("countdownRedirectUrl", e.target.value)
                        }
                        placeholder="Deixe vazio para WhatsApp"
                      />
                    </Field>
                  </div>
                )}
              </div>

              {/* Social Proof */}
              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UsersIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Prova Social</p>
                      <p className="text-xs text-muted-foreground">
                        Mostra quantas pessoas clicaram
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={values.socialProofEnabled}
                    onCheckedChange={(checked) =>
                      handleChange("socialProofEnabled", checked)
                    }
                  />
                </div>
                {values.socialProofEnabled && (
                  <div className="grid gap-3 pt-2 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>Número a exibir</FieldLabel>
                      <Input
                        type="number"
                        min={1}
                        value={values.socialProofCount}
                        onChange={(e) =>
                          handleChange("socialProofCount", Number(e.target.value))
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Texto</FieldLabel>
                      <Input
                        value={values.socialProofText}
                        onChange={(e) =>
                          handleChange("socialProofText", e.target.value)
                        }
                        placeholder="pessoas clicaram esta semana"
                      />
                    </Field>
                  </div>
                )}
              </div>

              {/* Exit Intent */}
              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DoorOpenIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Exit Intent</p>
                      <p className="text-xs text-muted-foreground">
                        Popup quando usuário tenta sair
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={values.exitIntentEnabled}
                    onCheckedChange={(checked) =>
                      handleChange("exitIntentEnabled", checked)
                    }
                  />
                </div>
                {values.exitIntentEnabled && (
                  <div className="space-y-3 pt-2">
                    <Field>
                      <FieldLabel>Mensagem</FieldLabel>
                      <Input
                        value={values.exitIntentMessage}
                        onChange={(e) =>
                          handleChange("exitIntentMessage", e.target.value)
                        }
                        placeholder="Espere! Não vá embora ainda..."
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Oferta Especial</FieldLabel>
                      <Input
                        value={values.exitIntentOfferText}
                        onChange={(e) =>
                          handleChange("exitIntentOfferText", e.target.value)
                        }
                        placeholder="Ganhe 10% OFF agora!"
                      />
                    </Field>
                  </div>
                )}
              </div>
            </FieldGroup>
          </CollapsibleContent>
        </Collapsible>

        {/* Trust Elements Section */}
        <Collapsible open={trustOpen} onOpenChange={setTrustOpen}>
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <ShieldCheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Elementos de Confiança</div>
                <div className="text-xs text-muted-foreground">
                  Selos de segurança e depoimentos
                </div>
              </div>
            </div>
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform duration-200",
                trustOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <FieldGroup className="space-y-4">
              {/* Security Badges */}
              <Field>
                <FieldLabel>Selos de Seguranca</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {SECURITY_BADGES.map((badge) => (
                    <Button
                      key={badge.id}
                      type="button"
                      variant={
                        values.securityBadges.includes(badge.id)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleBadge(badge.id)}
                      className="gap-1.5"
                    >
                      <badge.Icon className="h-3.5 w-3.5" />
                      {badge.label}
                    </Button>
                  ))}
                </div>
              </Field>

              {/* Testimonials */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel>Depoimentos</FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTestimonial}
                    disabled={values.testimonials.length >= 3}
                  >
                    <PlusIcon className="mr-1 h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
                <div className="space-y-3">
                  {values.testimonials.map((testimonial, index) => (
                    <div key={index} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <Textarea
                          value={testimonial.text}
                          onChange={(e) =>
                            updateTestimonial(index, "text", e.target.value)
                          }
                          placeholder="Texto do depoimento..."
                          rows={2}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTestimonial(index)}
                          className="shrink-0 text-destructive hover:text-destructive"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={testimonial.author}
                          onChange={(e) =>
                            updateTestimonial(index, "author", e.target.value)
                          }
                          placeholder="Nome do autor"
                          className="flex-1"
                        />
                        <Select
                          value={String(testimonial.rating)}
                          onValueChange={(value) =>
                            updateTestimonial(index, "rating", Number(value))
                          }
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue>
                              <StarRating rating={testimonial.rating} />
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <SelectItem key={rating} value={String(rating)}>
                                <StarRating rating={rating} />
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                  {values.testimonials.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      Nenhum depoimento adicionado
                    </p>
                  )}
                </div>
              </Field>
            </FieldGroup>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </ScrollArea>
  )
}

export { InterstitialConfigTabComponent as InterstitialConfigTab }

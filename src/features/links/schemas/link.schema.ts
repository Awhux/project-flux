import { z } from "zod"

/**
 * Testimonial schema
 */
export const testimonialSchema = z.object({
  text: z.string().min(1, "Texto é obrigatório").max(500, "Texto muito longo"),
  author: z.string().min(1, "Autor é obrigatório").max(100, "Nome muito longo"),
  rating: z.number().int().min(1).max(5),
})

/**
 * Interstitial configuration schema
 */
export const interstitialSchema = z.object({
  // Visual customization
  logo: z.string().url("URL inválida").optional().or(z.literal("")),
  headline: z.string().min(1, "Título é obrigatório").max(255, "Título muito longo"),
  description: z.string().max(1000, "Descrição muito longa").optional().default(""),
  buttonText: z.string().min(1, "Texto do botão é obrigatório").max(100, "Texto muito longo"),
  bgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida"),
  bgImage: z.string().url("URL inválida").optional().or(z.literal("")),
  bgOverlayOpacity: z.number().int().min(0).max(100),
  theme: z.enum(["light", "dark"]),

  // Form fields
  collectName: z.boolean(),
  nameRequired: z.boolean(),
  collectEmail: z.boolean(),
  emailRequired: z.boolean(),
  phoneLabel: z.string().max(50, "Label muito longa").optional().default("WhatsApp"),
  privacyPolicyUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  privacyCheckboxText: z.string().max(255, "Texto muito longo").optional().default("Aceito receber mensagens no WhatsApp"),

  // Advanced features
  customCss: z.string().max(10000, "CSS muito longo").optional(),
  countdownEnabled: z.boolean(),
  countdownSeconds: z.number().int().min(5).max(300).optional(),
  countdownRedirectUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  socialProofEnabled: z.boolean(),
  socialProofCount: z.number().int().min(1).optional(),
  socialProofText: z.string().max(100, "Texto muito longo").optional(),
  exitIntentEnabled: z.boolean(),
  exitIntentMessage: z.string().max(255, "Mensagem muito longa").optional(),
  exitIntentOfferText: z.string().max(255, "Texto muito longo").optional(),

  // Trust elements
  securityBadges: z.array(z.string()).max(10),
  testimonials: z.array(testimonialSchema).max(3),
})

/**
 * Link form data schema
 */
export const linkFormSchema = z.object({
  // Basic fields
  slug: z
    .string()
    .min(3, "Slug deve ter pelo menos 3 caracteres")
    .max(50, "Slug deve ter no máximo 50 caracteres")
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(/^(\+55 )?\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido: (XX) XXXXX-XXXX ou +55 (XX) XXXXX-XXXX"),
  message: z
    .string()
    .min(1, "Mensagem é obrigatória")
    .max(500, "Mensagem deve ter no máximo 500 caracteres"),

  // Facebook tracking
  pixelId: z
    .string()
    .regex(/^\d{15,16}$/, "Pixel ID deve ter 15-16 dígitos")
    .optional()
    .or(z.literal("")),
  capiToken: z.string().optional(),

  // Link configuration
  ghostMode: z.boolean(),

  // UTM defaults
  utmSource: z.string().max(255).optional(),
  utmMedium: z.string().max(255).optional(),
  utmCampaign: z.string().max(255).optional(),
  utmContent: z.string().max(255).optional(),

  // Interstitial configuration
  interstitial: interstitialSchema.optional(),
})

/**
 * Schema for link creation (without interstitial when ghostMode is false)
 */
export const createLinkSchema = linkFormSchema.refine(
  (data) => {
    // If ghostMode is enabled, interstitial config is recommended but not required
    return true
  },
  {
    message: "Configuração da página de captura é recomendada quando Ghost Mode está ativo",
  }
)

/**
 * Schema for link update (partial fields allowed)
 */
export const updateLinkSchema = linkFormSchema.partial()

// Type exports
export type TestimonialInput = z.infer<typeof testimonialSchema>
export type InterstitialInput = z.infer<typeof interstitialSchema>
export type LinkFormInput = z.infer<typeof linkFormSchema>
export type CreateLinkInput = z.infer<typeof createLinkSchema>
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>

import type { UserProfile, PasswordChangeData, ApiSettings } from "../types"

/**
 * Valida os dados do perfil
 */
export function validateProfile(profile: UserProfile): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!profile.firstName.trim()) {
    errors.firstName = "Nome é obrigatório"
  }

  if (!profile.lastName.trim()) {
    errors.lastName = "Sobrenome é obrigatório"
  }

  if (!profile.email.trim()) {
    errors.email = "E-mail é obrigatório"
  } else if (!isValidEmail(profile.email)) {
    errors.email = "E-mail inválido"
  }

  if (profile.phone && !isValidPhone(profile.phone)) {
    errors.phone = "Telefone inválido"
  }

  return errors
}

/**
 * Valida dados de alteração de senha
 */
export function validatePasswordChange(data: PasswordChangeData): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!data.currentPassword) {
    errors.currentPassword = "Senha atual é obrigatória"
  }

  if (!data.newPassword) {
    errors.newPassword = "Nova senha é obrigatória"
  } else if (data.newPassword.length < 8) {
    errors.newPassword = "A senha deve ter pelo menos 8 caracteres"
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Confirmação de senha é obrigatória"
  } else if (data.newPassword !== data.confirmPassword) {
    errors.confirmPassword = "As senhas não coincidem"
  }

  return errors
}

/**
 * Valida configurações de API
 */
export function validateApiSettings(
  settings: Partial<ApiSettings>
): Record<string, string> {
  const errors: Record<string, string> = {}

  if (settings.defaultPixelId && !isValidPixelId(settings.defaultPixelId)) {
    errors.defaultPixelId = "Pixel ID inválido (deve ter 15 dígitos)"
  }

  return errors
}

/**
 * Valida formato de e-mail
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida formato de telefone brasileiro
 */
function isValidPhone(phone: string): boolean {
  // Remove caracteres não numéricos
  const digits = phone.replace(/\D/g, "")
  // Telefone brasileiro: 10 ou 11 dígitos (com DDD)
  return digits.length >= 10 && digits.length <= 11
}

/**
 * Valida formato de Pixel ID do Facebook
 */
function isValidPixelId(pixelId: string): boolean {
  // Pixel ID é um número de 15 dígitos
  const digits = pixelId.replace(/\D/g, "")
  return digits.length === 15
}

/**
 * Formata telefone para exibição
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "")

  if (digits.length === 11) {
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  if (digits.length === 10) {
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return phone
}

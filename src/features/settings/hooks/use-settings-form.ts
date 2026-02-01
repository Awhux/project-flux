"use client"

import * as React from "react"

interface UseSettingsFormOptions<T> {
  /** Valores iniciais */
  initialValues: T
  /** Callback ao submeter */
  onSubmit: (values: T) => Promise<void>
  /** Validação */
  validate?: (values: T) => Record<string, string>
}

interface UseSettingsFormReturn<T> {
  /** Valores atuais do formulário */
  values: T
  /** Erros de validação */
  errors: Record<string, string>
  /** Se está submetendo */
  isSubmitting: boolean
  /** Se o formulário foi modificado */
  isDirty: boolean
  /** Atualiza um campo */
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void
  /** Submete o formulário */
  handleSubmit: (e: React.FormEvent) => void
  /** Reseta o formulário */
  reset: () => void
}

/**
 * Hook para gerenciar formulários de configurações
 */
export function useSettingsForm<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  validate,
}: UseSettingsFormOptions<T>): UseSettingsFormReturn<T> {
  const [values, setValues] = React.useState<T>(initialValues)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)

  const setFieldValue = <K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)
    // Limpa o erro do campo ao editar
    if (errors[field as string]) {
      setErrors((prev) => {
        const { [field as string]: _, ...rest } = prev
        return rest
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Valida se houver função de validação
    if (validate) {
      const validationErrors = validate(values)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }
    }

    setIsSubmitting(true)
    try {
      await onSubmit(values)
      setIsDirty(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setIsDirty(false)
  }

  // Atualiza valores iniciais quando mudam
  React.useEffect(() => {
    if (!isDirty) {
      setValues(initialValues)
    }
  }, [initialValues, isDirty])

  return {
    values,
    errors,
    isSubmitting,
    isDirty,
    setFieldValue,
    handleSubmit,
    reset,
  }
}

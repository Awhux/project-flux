"use client"

import * as React from "react"
import type { OverviewData } from "../types"
import { mockOverviewData } from "../config"

interface UseOverviewDataReturn {
  data: OverviewData
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook para gerenciar dados da página de visão geral
 * Atualmente usa dados mock, será substituído por API real
 */
export function useOverviewData(): UseOverviewDataReturn {
  const [data, setData] = React.useState<OverviewData>(mockOverviewData)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  const fetchData = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simula chamada de API
      await new Promise((resolve) => setTimeout(resolve, 500))
      setData(mockOverviewData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erro ao carregar dados"))
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  }
}

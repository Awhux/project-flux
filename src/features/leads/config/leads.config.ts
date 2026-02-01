import type { Lead } from "../types"

/**
 * Mock data for leads
 */
export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
    phone: "+55 (11) 98765-4321",
    link: "promo-verao",
    utmSource: "facebook",
    utmCampaign: "verao2026",
    capturedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "+55 (11) 99876-5432",
    link: "black-friday",
    utmSource: "instagram",
    utmMedium: "story",
    capturedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "Pedro Oliveira",
    phone: "+55 (21) 98765-1234",
    link: "promo-verao",
    utmSource: "google",
    capturedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "+55 (21) 99876-4321",
    link: "produto-novo",
    utmSource: "tiktok",
    utmCampaign: "lancamento",
    capturedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    name: "Carlos Pereira",
    phone: "+55 (11) 97654-3210",
    link: "black-friday",
    utmSource: "facebook",
    utmMedium: "feed",
    capturedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
]

/**
 * Date filter options in Portuguese
 */
export const dateFilterOptions = [
  { value: "all", label: "Todo Período" },
  { value: "7", label: "Últimos 7 dias" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "90", label: "Últimos 90 dias" },
] as const

/**
 * Link filter options - would be populated from available links
 */
export const linkFilterOptions = [
  { value: "all", label: "Todos os Links" },
  { value: "promo-verao", label: "promo-verao" },
  { value: "black-friday", label: "black-friday" },
  { value: "produto-novo", label: "produto-novo" },
] as const

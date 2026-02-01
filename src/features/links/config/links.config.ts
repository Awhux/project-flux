import type { Link } from "../types"

/**
 * Configuration for links feature
 */
export const ITEMS_PER_PAGE = 10
export const SLUG_MIN_LENGTH = 3
export const SLUG_MAX_LENGTH = 50
export const MESSAGE_MAX_LENGTH = 500

/**
 * Mock data for links - will be replaced with API
 */
export const mockLinks: Link[] = [
  {
    id: "1",
    slug: "promo-verao",
    destination: "+55 (11) 98765-4321",
    message: "Olá! Vi a promoção de verão e gostaria de saber mais sobre os produtos.",
    clicks: 1234,
    trend: { value: 12, isPositive: true },
    active: true,
    ghostMode: true,
    pixelId: "123456789012345",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    slug: "black-friday",
    destination: "+55 (11) 98765-4321",
    message: "Oi! Vi a oferta da Black Friday no {{utm_source}}. Pode me enviar mais detalhes?",
    clicks: 890,
    trend: { value: 5, isPositive: false },
    active: true,
    ghostMode: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    slug: "produto-novo",
    destination: "+55 (21) 99876-5432",
    message: "Olá! Gostaria de informações sobre o novo produto.",
    clicks: 567,
    trend: { value: 8, isPositive: true },
    active: false,
    ghostMode: false,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    slug: "curso-online",
    destination: "+55 (11) 97654-3210",
    message: "Quero saber mais sobre o curso online de {{utm_campaign}}.",
    clicks: 2340,
    trend: { value: 18, isPositive: true },
    active: true,
    ghostMode: true,
    pixelId: "987654321098765",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    slug: "consulta-gratis",
    destination: "+55 (21) 98765-9876",
    message: "Olá! Vi sobre a consulta grátis e gostaria de agendar.",
    clicks: 456,
    trend: { value: 3, isPositive: true },
    active: true,
    ghostMode: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
]

/**
 * Status filter options in Portuguese
 */
export const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "inactive", label: "Inativos" },
] as const

/**
 * Sort options in Portuguese
 */
export const sortOptions = [
  { value: "newest", label: "Mais recentes" },
  { value: "oldest", label: "Mais antigos" },
  { value: "most-clicks", label: "Mais cliques" },
  { value: "least-clicks", label: "Menos cliques" },
  { value: "a-z", label: "A-Z" },
  { value: "z-a", label: "Z-A" },
] as const

/**
 * UTM variables for message templates
 */
export const utmVariables = [
  "{{utm_source}}",
  "{{utm_campaign}}",
  "{{utm_content}}",
  "{{utm_medium}}",
] as const

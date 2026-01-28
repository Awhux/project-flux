export interface Link {
  id: string
  slug: string
  destination: string
  message: string
  clicks: number
  trend: { value: number; isPositive: boolean }
  active: boolean
  ghostMode: boolean
  pixelId?: string
  createdAt: Date
}

export const mockLinks: Link[] = [
  {
    id: "1",
    slug: "promo-summer",
    destination: "+55 (11) 98765-4321",
    message: "Olá! Vi a promoção de verão e gostaria de saber mais sobre os produtos.",
    clicks: 1234,
    trend: { value: 12, isPositive: true },
    active: true,
    ghostMode: true,
    pixelId: "123456789012345",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
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
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  },
  {
    id: "3",
    slug: "new-product",
    destination: "+55 (21) 99876-5432",
    message: "Olá! Gostaria de informações sobre o novo produto.",
    clicks: 567,
    trend: { value: 8, isPositive: true },
    active: false,
    ghostMode: false,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
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
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
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
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
]

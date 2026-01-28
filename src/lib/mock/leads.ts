export interface Lead {
  id: string
  name: string
  email?: string
  phone: string
  link: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  capturedAt: Date
}

export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
    phone: "+55 (11) 98765-4321",
    link: "promo-summer",
    utmSource: "Facebook",
    utmMedium: "Social",
    utmCampaign: "Summer Sale",
    capturedAt: new Date("2026-01-24T14:32:00"),
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "+55 (11) 99876-5432",
    link: "black-friday",
    utmSource: "Instagram",
    utmMedium: "Social",
    utmCampaign: "Black Friday",
    capturedAt: new Date("2026-01-23T10:15:00"),
  },
  {
    id: "3",
    name: "Pedro Oliveira",
    phone: "+55 (21) 98765-1234",
    link: "promo-summer",
    utmSource: "Google",
    utmMedium: "CPC",
    utmCampaign: "Summer Sale",
    capturedAt: new Date("2026-01-22T16:45:00"),
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "+55 (21) 99876-4321",
    link: "new-product",
    utmSource: "Direct",
    utmCampaign: "New Product Launch",
    capturedAt: new Date("2026-01-21T09:20:00"),
  },
  {
    id: "5",
    name: "Carlos Pereira",
    phone: "+55 (11) 97654-3210",
    link: "black-friday",
    utmSource: "Facebook",
    utmMedium: "Social",
    utmCampaign: "Black Friday",
    capturedAt: new Date("2026-01-20T18:30:00"),
  },
  {
    id: "6",
    name: "Juliana Fernandes",
    email: "juliana@email.com",
    phone: "+55 (11) 98123-4567",
    link: "curso-online",
    utmSource: "Instagram",
    utmMedium: "Social",
    utmCampaign: "Newsletter Q1",
    capturedAt: new Date("2026-01-19T11:15:00"),
  },
  {
    id: "7",
    name: "Roberto Lima",
    phone: "+55 (21) 97777-8888",
    link: "promo-summer",
    utmSource: "Email",
    utmMedium: "Email",
    utmCampaign: "Summer Sale",
    capturedAt: new Date("2026-01-18T15:45:00"),
  },
  {
    id: "8",
    name: "Patricia Alves",
    email: "patricia@email.com",
    phone: "+55 (11) 96543-2109",
    link: "consulta-gratis",
    utmSource: "Twitter",
    utmMedium: "Social",
    utmCampaign: "Brand Awareness",
    capturedAt: new Date("2026-01-17T13:20:00"),
  },
]

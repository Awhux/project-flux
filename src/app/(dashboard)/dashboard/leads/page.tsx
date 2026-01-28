import * as React from "react"
import { LeadsTable } from "@/components/dashboard/leads/leads-table"

// Mock data
const mockLeads = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
    phone: "+55 (11) 98765-4321",
    link: "promo-summer",
    capturedAt: "Jan 24, 2026",
    capturedTime: "14:32",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "+55 (11) 99876-5432",
    link: "black-friday",
    capturedAt: "Jan 23, 2026",
    capturedTime: "10:15",
  },
  {
    id: "3",
    name: "Pedro Oliveira",
    phone: "+55 (21) 98765-1234",
    link: "promo-summer",
    capturedAt: "Jan 22, 2026",
    capturedTime: "16:45",
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "+55 (21) 99876-4321",
    link: "new-product",
    capturedAt: "Jan 21, 2026",
    capturedTime: "09:20",
  },
  {
    id: "5",
    name: "Carlos Pereira",
    phone: "+55 (11) 97654-3210",
    link: "black-friday",
    capturedAt: "Jan 20, 2026",
    capturedTime: "18:30",
  },
]

export default function LeadsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
        <p className="text-muted-foreground mt-2">
          Manage leads captured through Ghost Mode
        </p>
      </div>

      <LeadsTable leads={mockLeads} />
    </div>
  )
}

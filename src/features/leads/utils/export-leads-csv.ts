import type { Lead } from "../types"

/**
 * Exports leads to CSV file with Portuguese headers
 */
export function exportLeadsToCSV(leads: Lead[], filename: string = "leads-export.csv"): void {
  const headers = ["Nome", "E-mail", "Telefone", "Link", "UTM Source", "UTM Medium", "UTM Campaign", "Capturado em"]

  const rows = leads.map((lead) => [
    lead.name,
    lead.email || "",
    lead.phone,
    lead.link,
    lead.utmSource || "",
    lead.utmMedium || "",
    lead.utmCampaign || "",
    lead.capturedAt.toISOString(),
  ])

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}

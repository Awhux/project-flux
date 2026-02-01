import type { Link } from "../types"

/**
 * Exports links to CSV file with Portuguese headers
 */
export function exportLinksToCSV(links: Link[], filename: string = "links-export.csv"): void {
  const headers = ["Slug", "Destino", "Cliques", "Status", "Modo Ghost", "Criado em"]

  const rows = links.map((link) => [
    link.slug,
    link.destination,
    link.clicks.toString(),
    link.active ? "Ativo" : "Inativo",
    link.ghostMode ? "Sim" : "Não",
    link.createdAt.toISOString(),
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

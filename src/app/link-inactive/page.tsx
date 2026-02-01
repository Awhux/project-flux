/**
 * Link Inactive Page
 * 
 * Displayed when a user tries to access a deactivated link.
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LinkIcon, HomeIcon } from "lucide-react"

export const metadata = {
  title: "Link Inativo",
  description: "Este link foi desativado ou não está mais disponível.",
}

export default function LinkInactivePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <LinkIcon className="h-10 w-10 text-gray-400" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-bold text-gray-900">
          Link Inativo
        </h1>

        {/* Description */}
        <p className="mb-8 text-gray-600">
          Ops! Este link foi desativado ou não está mais disponível.
          Entre em contato com o proprietário para mais informações.
        </p>

        {/* Back to Home */}
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <HomeIcon className="h-4 w-4" />
            Voltar ao início
          </Button>
        </Link>
      </div>
    </div>
  )
}

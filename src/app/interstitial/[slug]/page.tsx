"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { LeadCaptureForm } from "@/components/dashboard/interstitial/lead-capture-form"

export default function InterstitialPage() {
  const params = useParams()
  const slug = params.slug as string

  const handleSubmit = async (data: { name?: string; phone: string; email?: string }) => {
    console.log("Capturing lead:", { ...data, slug })

    // TODO: Save lead to database
    // TODO: Fire Facebook Pixel event

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // TODO: Redirect to WhatsApp with pre-filled message
    // For now, just redirect to WhatsApp
    const whatsappUrl = `https://wa.me/5511987654321?text=Olá!%20Vim%20através%20do%20link%20${slug}`
    window.location.href = whatsappUrl
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50">
      {/* Content */}
      <div className="relative z-10">
        <LeadCaptureForm
          onSubmit={handleSubmit}
          linkSlug={slug}
          headline="Garanta seu desconto exclusivo"
          subheadline="Confirme seu WhatsApp para continuar"
          socialProofCount={1247}
        />
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LockIcon, ShieldCheckIcon, UsersIcon, StarIcon } from "lucide-react"

interface TrustSignalsProps {
  leadsCount?: number
  showSecurityBadge?: boolean
  showSocialProof?: boolean
  showRating?: boolean
  className?: string
}

export function TrustSignals({
  leadsCount = 0,
  showSecurityBadge = true,
  showSocialProof = true,
  showRating = false,
  className,
}: TrustSignalsProps) {
  // Animated counter for social proof
  const [displayCount, setDisplayCount] = React.useState(0)

  React.useEffect(() => {
    if (leadsCount > 0 && showSocialProof) {
      // Animate the counter
      const duration = 1500 // ms
      const steps = 30
      const increment = leadsCount / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= leadsCount) {
          setDisplayCount(leadsCount)
          clearInterval(timer)
        } else {
          setDisplayCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [leadsCount, showSocialProof])

  // Format number with K suffix for thousands
  const formatCount = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`
    }
    return num.toString()
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Social Proof Counter */}
      {showSocialProof && leadsCount > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="flex -space-x-2">
            {/* Avatar Stack */}
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 ring-2 ring-white" />
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 ring-2 ring-white" />
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 ring-2 ring-white" />
          </div>
          <span>
            <strong className="font-semibold text-gray-900">
              +{formatCount(displayCount)}
            </strong>{" "}
            pessoas já garantiram
          </span>
        </div>
      )}

      {/* Rating */}
      {showRating && (
        <div className="flex items-center justify-center gap-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            4.9 de 5 - <span className="text-gray-500">2,847 avaliações</span>
          </span>
        </div>
      )}

      {/* Security Badges */}
      {showSecurityBadge && (
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <LockIcon className="h-3.5 w-3.5 text-green-600" />
            <span>Dados protegidos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheckIcon className="h-3.5 w-3.5 text-blue-600" />
            <span>100% seguro</span>
          </div>
          <div className="flex items-center gap-1.5">
            <UsersIcon className="h-3.5 w-3.5 text-purple-600" />
            <span>Não compartilhamos</span>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <p className="text-center text-xs text-gray-400">
        Ao continuar, você concorda com nossa{" "}
        <a href="#" className="text-primary hover:underline">
          Política de Privacidade
        </a>
      </p>
    </div>
  )
}

// Compact version for inline use
export function TrustBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700",
        className
      )}
    >
      <ShieldCheckIcon className="h-3.5 w-3.5" />
      <span>Verificado e seguro</span>
    </div>
  )
}

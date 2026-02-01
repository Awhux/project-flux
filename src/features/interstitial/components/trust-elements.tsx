"use client"

import * as React from "react"
import {
  LockIcon,
  ShieldIcon,
  FileTextIcon,
  CheckCircleIcon,
  StarIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { TrustElementsProps, Testimonial } from "../types"

/**
 * Icon mapping for security badges (no emojis)
 */
const BADGE_ICONS: Record<string, React.ReactNode> = {
  ssl: <LockIcon className="h-3.5 w-3.5" />,
  privacy: <ShieldIcon className="h-3.5 w-3.5" />,
  lgpd: <FileTextIcon className="h-3.5 w-3.5" />,
  verified: <CheckCircleIcon className="h-3.5 w-3.5" />,
}

/**
 * Label mapping for security badges
 */
const BADGE_LABELS: Record<string, string> = {
  ssl: "SSL Seguro",
  privacy: "Privacidade",
  lgpd: "LGPD",
  verified: "Verificado",
}

/**
 * Star rating component
 */
const StarRating = React.memo(function StarRating({
  rating,
  isDark,
}: {
  rating: number
  isDark: boolean
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={cn(
            "h-3.5 w-3.5",
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : isDark
                ? "text-white/30"
                : "text-gray-300"
          )}
        />
      ))}
    </div>
  )
})

/**
 * Security badge component
 */
const SecurityBadge = React.memo(function SecurityBadge({
  badgeId,
  isDark,
}: {
  badgeId: string
  isDark: boolean
}) {
  const icon = BADGE_ICONS[badgeId]
  const label = BADGE_LABELS[badgeId]

  if (!icon || !label) return null

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
        isDark
          ? "bg-white/10 text-white/80 backdrop-blur-sm"
          : "bg-gray-100 text-gray-700"
      )}
    >
      {icon}
      <span>{label}</span>
    </div>
  )
})

/**
 * Testimonial card component
 */
const TestimonialCard = React.memo(function TestimonialCard({
  testimonial,
  isDark,
}: {
  testimonial: Testimonial
  isDark: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-4 text-left",
        isDark ? "bg-white/10 backdrop-blur-sm" : "bg-white/80 shadow-sm"
      )}
    >
      <StarRating rating={testimonial.rating} isDark={isDark} />
      <p
        className={cn(
          "mt-2 text-sm line-clamp-3",
          isDark ? "text-white/90" : "text-gray-700"
        )}
      >
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <p
        className={cn(
          "mt-2 text-xs font-medium",
          isDark ? "text-white/70" : "text-gray-500"
        )}
      >
        — {testimonial.author}
      </p>
    </div>
  )
})

/**
 * Trust elements component for the interstitial page
 * Displays security badges and testimonials
 */
export const TrustElements = React.memo(function TrustElements({
  securityBadges,
  testimonials,
  theme,
  className,
}: TrustElementsProps) {
  const isDark = theme === "dark"
  const hasContent = securityBadges.length > 0 || testimonials.length > 0

  if (!hasContent) return null

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Security Badges */}
      {securityBadges.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {securityBadges.map((badgeId) => (
            <SecurityBadge key={badgeId} badgeId={badgeId} isDark={isDark} />
          ))}
        </div>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <div className="space-y-3">
          {testimonials.slice(0, 2).map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              isDark={isDark}
            />
          ))}
        </div>
      )}
    </div>
  )
})

TrustElements.displayName = "TrustElements"

"use client"

import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { brandConfig } from "../config/navigation.config"

/**
 * CVA variants for logo sizing
 */
const navigationLogoVariants = cva("flex items-center gap-2", {
  variants: {
    size: {
      default: "",
      sm: "",
      lg: "",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const logoIconVariants = cva(
  "flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold",
  {
    variants: {
      size: {
        default: "size-8 text-sm",
        sm: "size-6 text-xs",
        lg: "size-10 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const logoTextVariants = cva("font-semibold", {
  variants: {
    size: {
      default: "text-lg",
      sm: "text-base",
      lg: "text-xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface NavigationLogoProps
  extends VariantProps<typeof navigationLogoVariants> {
  /** Additional CSS classes */
  className?: string
  /** Whether to show the brand name text */
  showText?: boolean
  /** Whether the logo should be a link to home */
  asLink?: boolean
}

/**
 * Navigation logo component
 * Displays brand icon and optional text
 */
export function NavigationLogo({
  className,
  size,
  showText = true,
  asLink = true,
}: NavigationLogoProps) {
  const content = (
    <>
      <div className={cn(logoIconVariants({ size }))}>
        {brandConfig.shortName}
      </div>
      {showText && (
        <span className={cn(logoTextVariants({ size }))}>
          {brandConfig.name}
        </span>
      )}
    </>
  )

  if (asLink) {
    return (
      <Link
        href="/"
        className={cn(navigationLogoVariants({ size }), className)}
      >
        {content}
      </Link>
    )
  }

  return (
    <div className={cn(navigationLogoVariants({ size }), className)}>
      {content}
    </div>
  )
}

export { navigationLogoVariants, logoIconVariants, logoTextVariants }

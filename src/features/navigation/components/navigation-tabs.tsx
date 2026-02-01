"use client"

import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { navigationItems } from "../config/navigation.config"
import { useNavigation } from "../hooks/use-navigation"

/**
 * CVA variants for navigation tab styling
 * Provides consistent, customizable tab appearance
 */
const navigationTabVariants = cva(
  "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
  {
    variants: {
      variant: {
        active: "border-primary text-foreground",
        inactive:
          "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
      },
      size: {
        default: "h-14",
        sm: "h-12",
      },
    },
    defaultVariants: {
      variant: "inactive",
      size: "default",
    },
  }
)

export interface NavigationTabsProps
  extends VariantProps<typeof navigationTabVariants> {
  /** Additional CSS classes */
  className?: string
  /** Whether to show icons alongside text */
  showIcons?: boolean
}

/**
 * Horizontal navigation tabs component
 * Renders navigation items as horizontal tabs with active state
 */
export function NavigationTabs({
  className,
  size,
  showIcons = false,
}: NavigationTabsProps) {
  const { isActive } = useNavigation()

  return (
    <nav className={cn("flex items-center", className)}>
      {navigationItems.map((item) => {
        const active = isActive(item.href)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              navigationTabVariants({
                variant: active ? "active" : "inactive",
                size,
              })
            )}
          >
            {showIcons && <Icon className="size-4" />}
            <span>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export { navigationTabVariants }

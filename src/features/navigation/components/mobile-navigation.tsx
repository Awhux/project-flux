"use client"

import Link from "next/link"
import { MenuIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { navigationItems, mockUser, mockPlan, brandConfig } from "../config/navigation.config"
import { useNavigation } from "../hooks/use-navigation"

/**
 * CVA variants for mobile navigation item styling
 */
const mobileNavItemVariants = cva(
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        active: "bg-primary text-primary-foreground",
        inactive: "text-muted-foreground hover:bg-muted hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "inactive",
    },
  }
)

export interface MobileNavigationProps
  extends VariantProps<typeof mobileNavItemVariants> {
  /** Additional CSS classes */
  className?: string
}

/**
 * Mobile navigation component
 * Uses Sheet component for slide-out drawer navigation
 */
export function MobileNavigation({ className }: MobileNavigationProps) {
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu, isActive } =
    useNavigation()
  const user = mockUser
  const plan = mockPlan

  return (
    <>
      {/* Hamburger Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(className)}
        onClick={openMobileMenu}
        aria-label="Open menu"
      >
        <MenuIcon className="size-5" />
      </Button>

      {/* Mobile Sheet Navigation */}
      <Sheet open={isMobileMenuOpen} onOpenChange={closeMobileMenu}>
        <SheetContent side="left" className="w-72 p-0" showCloseButton>
          {/* Header with Logo */}
          <SheetHeader className="border-b border-border px-6 py-4">
            <SheetTitle className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                {brandConfig.shortName}
              </div>
              <span className="text-lg font-semibold">{brandConfig.name}</span>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigation menu
            </SheetDescription>
          </SheetHeader>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigationItems.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    mobileNavItemVariants({
                      variant: active ? "active" : "inactive",
                    })
                  )}
                >
                  <Icon className="size-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}

export { mobileNavItemVariants }

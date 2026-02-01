"use client"

import { BellIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { UserMenu } from "./user-menu"
import { mockPlan } from "../config/navigation.config"

export interface NavigationActionsProps {
  /** Additional CSS classes */
  className?: string
  /** Whether to show the plan badge */
  showPlanBadge?: boolean
  /** Whether to show notifications */
  showNotifications?: boolean
}

/**
 * Right side navigation actions
 * Contains plan badge, notifications, and user menu
 */
export function NavigationActions({
  className,
  showPlanBadge = true,
  showNotifications = true,
}: NavigationActionsProps) {
  const plan = mockPlan

  return (
    <div className={cn("flex items-center gap-2 md:gap-3", className)}>
      {/* Plan Badge - Hidden on small screens */}
      {showPlanBadge && (
        <Badge
          variant={plan.isPaid ? "default" : "secondary"}
          className="hidden md:inline-flex"
        >
          {plan.name}
        </Badge>
      )}

      {/* Notifications */}
      {showNotifications && (
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="size-4" />
          {/* Notification indicator dot */}
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
          <span className="sr-only">Notifications</span>
        </Button>
      )}

      {/* User Menu */}
      <UserMenu />
    </div>
  )
}

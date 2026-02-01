"use client"

import Link from "next/link"
import {
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  SparklesIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { mockUser, mockPlan } from "../config/navigation.config"

export interface UserMenuProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * User dropdown menu with profile info and plan details
 * Consolidates user actions and plan information
 */
export function UserMenu({ className }: UserMenuProps) {
  const user = mockUser
  const plan = mockPlan

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full", className)}
          />
        }
      >
        <Avatar size="sm">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            {user.initials}
          </AvatarFallback>
        </Avatar>
        <span className="sr-only">User menu</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* User Info */}
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{user.name}</p>
              <Badge
                variant={plan.isPaid ? "default" : "secondary"}
                className="text-[10px] px-1.5 py-0"
              >
                {plan.name}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Upgrade Plan - Only show for free users */}
        {!plan.isPaid && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/settings/billing" className="cursor-pointer">
                <SparklesIcon className="mr-2 size-4 text-primary" />
                <span>Upgrade Plan</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Profile & Settings */}
        <DropdownMenuItem asChild>
          <Link href="/settings/profile" className="cursor-pointer">
            <UserIcon className="mr-2 size-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <SettingsIcon className="mr-2 size-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign Out */}
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
        >
          <LogOutIcon className="mr-2 size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

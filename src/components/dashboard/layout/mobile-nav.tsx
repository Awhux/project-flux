"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  LinkIcon,
  BarChart3Icon,
  UsersIcon,
  SettingsIcon,
  XIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    name: "Links",
    href: "/dashboard/links",
    icon: LinkIcon,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3Icon,
  },
  {
    name: "Leads",
    href: "/dashboard/leads",
    icon: UsersIcon,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: SettingsIcon,
  },
]

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-background lg:hidden">
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                ZL
              </div>
              <span className="text-lg font-semibold">ZapLink</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XIcon className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-border p-4">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs font-medium text-foreground mb-1">Free Plan</p>
              <p className="text-xs text-muted-foreground">
                Upgrade for unlimited features
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

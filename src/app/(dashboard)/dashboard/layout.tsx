"use client"

import * as React from "react"
import { SidebarNav } from "@/components/dashboard/layout/sidebar-nav"
import { Header } from "@/components/dashboard/layout/header"
import { MobileNav } from "@/components/dashboard/layout/mobile-nav"
import { usePathname } from "next/navigation"

// Page title mapping
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/links": "Links",
  "/dashboard/analytics": "Analytics",
  "/dashboard/leads": "Leads",
  "/dashboard/settings": "Settings",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()
  const title = pageTitles[pathname] || "Dashboard"

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarNav />
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        <Header
          title={title}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="min-h-[calc(100vh-4rem)] bg-muted/30 p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

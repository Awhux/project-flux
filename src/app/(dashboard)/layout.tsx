"use client"

import { NavigationBar } from "@/features/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Main Content */}
      <main className="min-h-[calc(100vh-3.5rem)] bg-muted/30 p-4 md:p-6">
        <div className="mx-auto max-w-308">{children}</div>
      </main>
    </div>
  )
}

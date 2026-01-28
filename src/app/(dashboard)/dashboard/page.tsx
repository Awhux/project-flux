import * as React from "react"
import { MousePointer2Icon, UsersIcon, PercentIcon, LinkIcon } from "lucide-react"
import { MetricCard } from "@/components/dashboard/metrics/metric-card"
import { UsageIndicator } from "@/components/dashboard/metrics/usage-indicator"
import { ClicksChart } from "@/components/dashboard/analytics/clicks-chart"
import { UtmBreakdown } from "@/components/dashboard/analytics/utm-breakdown"

// Mock data - will be replaced with real data later
const mockClicksData = [
  { date: "Jan 1", clicks: 120 },
  { date: "Jan 5", clicks: 180 },
  { date: "Jan 10", clicks: 240 },
  { date: "Jan 15", clicks: 320 },
  { date: "Jan 20", clicks: 280 },
  { date: "Jan 25", clicks: 360 },
  { date: "Jan 30", clicks: 420 },
]

const mockUtmData = [
  { source: "Facebook", clicks: 1250 },
  { source: "Instagram", clicks: 980 },
  { source: "Google", clicks: 750 },
  { source: "Direct", clicks: 420 },
  { source: "Twitter", clicks: 230 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your ZapLink performance
        </p>
      </div>

      {/* Metrics Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Clicks"
          value="12,345"
          icon={MousePointer2Icon}
          trend={{ value: 12.5, isPositive: true }}
          iconClassName="text-blue-600"
          iconBgClassName="bg-blue-600/10"
        />
        <MetricCard
          label="Total Leads"
          value="1,234"
          icon={UsersIcon}
          trend={{ value: 8.2, isPositive: true }}
          iconClassName="text-green-600"
          iconBgClassName="bg-green-600/10"
        />
        <MetricCard
          label="Conversion Rate"
          value="10.2%"
          icon={PercentIcon}
          trend={{ value: 2.1, isPositive: false }}
          iconClassName="text-purple-600"
          iconBgClassName="bg-purple-600/10"
        />
        <MetricCard
          label="Active Links"
          value="24"
          icon={LinkIcon}
          iconClassName="text-orange-600"
          iconBgClassName="bg-orange-600/10"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ClicksChart data={mockClicksData} />
        <UtmBreakdown data={mockUtmData} />
      </div>

      {/* Usage Indicator */}
      <UsageIndicator current={45} limit={100} planTier="FREE" />
    </div>
  )
}

"use client"

import * as React from "react"
import { MousePointer2Icon, UsersIcon, PercentIcon, LinkIcon, DownloadIcon } from "lucide-react"
import { MetricCard } from "@/components/dashboard/metrics/metric-card"
import { ClicksChart } from "@/components/dashboard/analytics/clicks-chart"
import { UtmBreakdown } from "@/components/dashboard/analytics/utm-breakdown"
import { DeviceChart } from "@/components/dashboard/analytics/device-chart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data
const mockClicksData = [
  { date: "Jan 1", clicks: 120 },
  { date: "Jan 5", clicks: 180 },
  { date: "Jan 10", clicks: 240 },
  { date: "Jan 15", clicks: 320 },
  { date: "Jan 20", clicks: 280 },
  { date: "Jan 25", clicks: 360 },
  { date: "Jan 30", clicks: 420 },
]

const mockUtmSource = [
  { source: "Facebook", clicks: 1250 },
  { source: "Instagram", clicks: 980 },
  { source: "Google", clicks: 750 },
  { source: "Direct", clicks: 420 },
  { source: "Twitter", clicks: 230 },
]

const mockUtmMedium = [
  { source: "Social", clicks: 2230 },
  { source: "CPC", clicks: 1050 },
  { source: "Organic", clicks: 890 },
  { source: "Email", clicks: 460 },
]

const mockUtmCampaign = [
  { source: "Summer Sale", clicks: 1800 },
  { source: "Black Friday", clicks: 1200 },
  { source: "New Product", clicks: 950 },
  { source: "Newsletter", clicks: 680 },
]

const mockDeviceData = [
  { device: "Mobile", value: 2540 },
  { device: "Desktop", value: 1320 },
  { device: "Tablet", value: 560 },
  { device: "Other", value: 210 },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = React.useState("30")
  const [selectedLink, setSelectedLink] = React.useState("all")

  return (
    <div className="space-y-8">
      {/* Header with Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground mt-2">
            Detailed insights into your link performance
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedLink} onValueChange={setSelectedLink}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select link" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Links</SelectItem>
              <SelectItem value="1">promo-summer</SelectItem>
              <SelectItem value="2">black-friday</SelectItem>
              <SelectItem value="3">new-product</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
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
          label="Avg. Click Time"
          value="2.5m"
          icon={LinkIcon}
          iconClassName="text-orange-600"
          iconBgClassName="bg-orange-600/10"
        />
      </div>

      {/* Main Chart */}
      <ClicksChart data={mockClicksData} />

      {/* UTM Parameters with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>UTM Parameters Breakdown</CardTitle>
          <CardDescription>Analyze traffic by UTM parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="source" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="source">Source</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="campaign">Campaign</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
            <TabsContent value="source" className="mt-6">
              <UtmBreakdown data={mockUtmSource} />
            </TabsContent>
            <TabsContent value="medium" className="mt-6">
              <UtmBreakdown data={mockUtmMedium} />
            </TabsContent>
            <TabsContent value="campaign" className="mt-6">
              <UtmBreakdown data={mockUtmCampaign} />
            </TabsContent>
            <TabsContent value="content" className="mt-6">
              <div className="flex items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No content data available</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Device Distribution */}
      <DeviceChart data={mockDeviceData} />
    </div>
  )
}

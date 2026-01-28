"use client"

import * as React from "react"
import {
  LinkIcon,
  MousePointerClickIcon,
  TrendingUpIcon,
  ToggleRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface LinkStats {
  totalLinks: number
  totalClicks: number
  activeLinks: number
  avgClickRate: number
  clicksTrend?: { value: number; isPositive: boolean }
}

interface LinksStatsProps {
  stats: LinkStats
  isLoading?: boolean
}

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  iconBgColor: string
  iconColor: string
  trend?: { value: number; isPositive: boolean }
  isLoading?: boolean
}

function StatCard({
  label,
  value,
  icon,
  iconBgColor,
  iconColor,
  trend,
  isLoading,
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className={cn("h-12 w-12 animate-pulse rounded-lg", iconBgColor)} />
        </div>
        {trend && (
          <div className="mt-4 h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {label}
          </p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            iconBgColor
          )}
        >
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          {trend.isPositive ? (
            <ArrowUpIcon className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-600" />
          )}
          <span
            className={cn(
              "text-sm font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {Math.abs(trend.value)}%
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            vs last month
          </span>
        </div>
      )}
    </div>
  )
}

export function LinksStats({ stats, isLoading }: LinksStatsProps) {
  const activeRatio =
    stats.totalLinks > 0
      ? Math.round((stats.activeLinks / stats.totalLinks) * 100)
      : 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Links"
        value={stats.totalLinks}
        icon={<LinkIcon className="h-6 w-6" />}
        iconBgColor="bg-indigo-100 dark:bg-indigo-900/30"
        iconColor="text-indigo-600 dark:text-indigo-400"
        isLoading={isLoading}
      />
      <StatCard
        label="Total Clicks"
        value={stats.totalClicks}
        icon={<MousePointerClickIcon className="h-6 w-6" />}
        iconBgColor="bg-green-100 dark:bg-green-900/30"
        iconColor="text-green-600 dark:text-green-400"
        trend={stats.clicksTrend}
        isLoading={isLoading}
      />
      <StatCard
        label="Avg. Click Rate"
        value={`${stats.avgClickRate.toFixed(1)}%`}
        icon={<TrendingUpIcon className="h-6 w-6" />}
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        iconColor="text-blue-600 dark:text-blue-400"
        isLoading={isLoading}
      />
      <StatCard
        label="Active Links"
        value={`${stats.activeLinks}/${stats.totalLinks}`}
        icon={<ToggleRightIcon className="h-6 w-6" />}
        iconBgColor="bg-purple-100 dark:bg-purple-900/30"
        iconColor="text-purple-600 dark:text-purple-400"
        isLoading={isLoading}
      />
    </div>
  )
}

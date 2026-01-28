import * as React from "react"
import { ArrowUpIcon, ArrowDownIcon, LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  iconClassName?: string
  iconBgClassName?: string
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  iconClassName = "text-primary",
  iconBgClassName = "bg-primary/10",
}: MetricCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Left: Label & Value */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>

          {/* Right: Icon */}
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              iconBgClassName
            )}
          >
            <Icon className={cn("h-6 w-6", iconClassName)} />
          </div>
        </div>

        {/* Trend */}
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
            <span className="text-sm text-muted-foreground">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

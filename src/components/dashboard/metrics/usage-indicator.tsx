import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface UsageIndicatorProps {
  current: number
  limit: number
  planTier: "FREE" | "PRO" | "AGENCY"
}

export function UsageIndicator({ current, limit, planTier }: UsageIndicatorProps) {
  const percentage = (current / limit) * 100
  const remaining = limit - current

  // Determine color based on usage
  const getProgressColor = () => {
    if (percentage <= 70) return "bg-primary"
    if (percentage <= 90) return "bg-yellow-500"
    return "bg-destructive"
  }

  const showWarning = percentage >= 80

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>
              {planTier} Plan: {limit.toLocaleString()} clicks/month
            </CardDescription>
          </div>
          <Badge variant={planTier === "FREE" ? "secondary" : "default"}>
            {planTier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={percentage} className="h-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">
              {current.toLocaleString()} clicks
            </span>
            <span className="text-muted-foreground">
              {remaining.toLocaleString()} remaining
            </span>
          </div>
        </div>

        {/* Warning */}
        {showWarning && planTier === "FREE" && (
          <div className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
            <AlertCircleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-yellow-900 dark:text-yellow-100">
                Approaching limit
              </p>
              <p className="text-yellow-800 dark:text-yellow-200">
                Upgrade to Pro for unlimited clicks
              </p>
            </div>
          </div>
        )}

        {/* Upgrade Button */}
        {planTier === "FREE" && (
          <Button className="w-full" variant="default">
            Upgrade to Pro
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

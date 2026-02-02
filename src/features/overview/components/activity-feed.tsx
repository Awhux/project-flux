"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MousePointer2Icon,
  UserPlusIcon,
  MessageSquareIcon,
  LinkIcon,
  ActivityIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

type ActivityType = "click" | "lead" | "whatsapp" | "link_created"

interface Activity {
  id: string
  type: ActivityType
  /** Link slug associated with the activity */
  linkSlug: string
  /** Additional data based on type */
  metadata?: {
    /** For leads: visitor name if captured */
    visitorName?: string
    /** For clicks: UTM source */
    utmSource?: string
    /** For clicks: region/country */
    region?: string
  }
  /** Timestamp of the activity */
  timestamp: Date
}

export interface ActivityFeedProps {
  /** Atividades recentes */
  activities: Activity[]
  /** Estado de carregamento */
  isLoading?: boolean
  /** Classes CSS adicionais */
  className?: string
}

const activityConfig: Record<ActivityType, {
  icon: React.ElementType
  label: string
}> = {
  click: {
    icon: MousePointer2Icon,
    label: "Novo clique",
  },
  lead: {
    icon: UserPlusIcon,
    label: "Lead capturado",
  },
  whatsapp: {
    icon: MessageSquareIcon,
    label: "WhatsApp aberto",
  },
  link_created: {
    icon: LinkIcon,
    label: "Link criado",
  },
}

/**
 * Feed de atividades recentes
 * Mostra últimas 10 ações (cliques, leads, etc.)
 * 
 * Segue 70/10/10: 70% neutral (gray icons), 10% primary (link slugs), 10% accent (live indicator)
 */
export function ActivityFeed({
  activities,
  isLoading,
  className,
}: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Atividade Recente</CardTitle>
          <CardDescription>Últimos eventos em tempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Atividade Recente</CardTitle>
          <CardDescription>Últimos eventos em tempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <ActivityIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Nenhuma atividade recente
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              As atividades aparecerão aqui em tempo real
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Atividade Recente</CardTitle>
            <CardDescription>Últimos eventos em tempo real</CardDescription>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs text-muted-foreground">Ao vivo</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type]
            const Icon = config.icon

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-all duration-200 hover:bg-muted/50 animate-in fade-in slide-in-from-top-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon - neutral colors following 70/10/10 principle */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{config.label}</span>
                    <span className="text-sm text-muted-foreground">em</span>
                    <span className="truncate text-sm font-medium text-primary">
                      /{activity.linkSlug}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {formatDistanceToNow(activity.timestamp, {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                    {activity.metadata?.visitorName && (
                      <>
                        <span>•</span>
                        <span>{activity.metadata.visitorName}</span>
                      </>
                    )}
                    {activity.metadata?.utmSource && (
                      <>
                        <span>•</span>
                        <span>via {activity.metadata.utmSource}</span>
                      </>
                    )}
                    {activity.metadata?.region && (
                      <>
                        <span>•</span>
                        <span>{activity.metadata.region}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

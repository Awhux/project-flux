"use client"

import * as React from "react"
import { EyeIcon, DownloadIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Lead {
  id: string
  name: string
  email?: string
  phone: string
  link: string
  capturedAt: string
  capturedTime: string
}

interface LeadsTableProps {
  leads: Lead[]
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [dateFilter, setDateFilter] = React.useState("all")
  const [linkFilter, setLinkFilter] = React.useState("all")

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-600",
      "bg-green-600",
      "bg-purple-600",
      "bg-orange-600",
      "bg-pink-600",
      "bg-teal-600",
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log("Exporting leads...")
  }

  if (leads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Captured Leads</CardTitle>
              <CardDescription>
                Leads captured through Ghost Mode interstitial
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <UsersIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No leads captured yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Enable Ghost Mode on your links to start capturing lead information before WhatsApp redirect.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Captured Leads</CardTitle>
            <CardDescription>
              Leads captured through Ghost Mode interstitial
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={linkFilter} onValueChange={setLinkFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All links" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Links</SelectItem>
                <SelectItem value="1">promo-summer</SelectItem>
                <SelectItem value="2">black-friday</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Captured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  {/* Lead Column */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className={getAvatarColor(lead.name)}>
                          {getInitials(lead.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{lead.name}</div>
                        {lead.email && (
                          <div className="text-xs text-muted-foreground">
                            {lead.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Phone Number Column */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇧🇷</span>
                      <span className="text-sm text-muted-foreground">
                        {lead.phone}
                      </span>
                    </div>
                  </TableCell>

                  {/* Link Column */}
                  <TableCell>
                    <a
                      href={`/dashboard/links`}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      zap.lk/{lead.link}
                    </a>
                  </TableCell>

                  {/* Captured Date Column */}
                  <TableCell>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {lead.capturedAt}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {lead.capturedTime}
                      </div>
                    </div>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <EyeIcon className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

import { UsersIcon } from "lucide-react"

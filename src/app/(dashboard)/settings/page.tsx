"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SettingsPage() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="plan">Plan & Billing</TabsTrigger>
          <TabsTrigger value="api">API Settings</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      JS
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Upload Photo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <FieldGroup>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                      <Input id="firstName" defaultValue="João" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                      <Input id="lastName" defaultValue="Silva" />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="joao@example.com"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue="+55 (11) 98765-4321"
                    />
                  </Field>
                </FieldGroup>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
                    <Input id="currentPassword" type="password" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                    <Input id="newPassword" type="password" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
                    <Input id="confirmPassword" type="password" />
                  </Field>
                </FieldGroup>

                <div className="flex justify-end">
                  <Button>Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plan & Billing */}
        <TabsContent value="plan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Manage your subscription plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-border p-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold">Free Plan</h3>
                    <Badge variant="secondary">CURRENT</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    100 clicks/month • 1 active link • Basic analytics
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">$0</p>
                  <p className="text-sm text-muted-foreground">/month</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Upgrade to Pro</h4>
                <div className="rounded-lg border border-primary bg-primary/5 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">Pro Plan</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        5,000 clicks/month • Unlimited links • Facebook CAPI • Ghost Mode
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">$29</p>
                      <p className="text-sm text-muted-foreground">/month</p>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    Upgrade to Pro
                  </Button>
                </div>

                <div className="rounded-lg border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">Agency Plan</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Unlimited clicks • Unlimited links • Priority support • White-label
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">$99</p>
                      <p className="text-sm text-muted-foreground">/month</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" size="lg">
                    Upgrade to Agency
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your past invoices and receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No billing history available</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Facebook Pixel</CardTitle>
              <CardDescription>
                Configure global Facebook Pixel settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="defaultPixelId">Default Pixel ID</FieldLabel>
                    <Input
                      id="defaultPixelId"
                      placeholder="123456789012345"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This pixel will be used for all links unless overridden
                    </p>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="defaultCapiToken">
                      Default Conversions API Token
                    </FieldLabel>
                    <Input
                      id="defaultCapiToken"
                      type="password"
                      placeholder="Enter your CAPI token"
                    />
                  </Field>
                </FieldGroup>

                <div className="flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage API keys and webhooks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-sm font-medium mb-2">API Key</p>
                  <div className="flex items-center gap-2">
                    <Input
                      value="zaplink_••••••••••••••••"
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm">
                      Regenerate
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  API documentation coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts via SMS
                  </p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, sms: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive browser notifications
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Set your language and timezone</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="language">Language</FieldLabel>
                    <Select defaultValue="pt-br">
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                    <Select defaultValue="america-sao-paulo">
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america-sao-paulo">
                          (GMT-3) São Paulo
                        </SelectItem>
                        <SelectItem value="america-new-york">
                          (GMT-5) New York
                        </SelectItem>
                        <SelectItem value="europe-london">
                          (GMT+0) London
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>

                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

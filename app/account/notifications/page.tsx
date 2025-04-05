"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Mail, Smartphone, Tag, ShoppingBag, MessageSquare, Megaphone, Loader2, Save } from "lucide-react"

export default function NotificationsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Notification settings state
  const [emailSettings, setEmailSettings] = useState({
    orderUpdates: true,
    promotions: false,
    newItems: true,
    priceDrops: true,
    newsletter: false,
    accountAlerts: true,
    supportMessages: true,
  })

  const [pushSettings, setPushSettings] = useState({
    orderUpdates: true,
    promotions: false,
    newItems: false,
    priceDrops: true,
    accountAlerts: true,
    supportMessages: true,
  })

  const handleEmailToggle = (key: keyof typeof emailSettings) => {
    setEmailSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handlePushToggle = (key: keyof typeof pushSettings) => {
    setPushSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)

    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-gaming text-2xl text-primary">Notification Settings</h1>
        <p className="text-sm text-muted-foreground">Manage how and when you receive notifications</p>
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Notifications
          </TabsTrigger>
          <TabsTrigger value="push" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Push Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notification Preferences
              </CardTitle>
              <CardDescription>Choose which emails you'd like to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-start gap-3">
                    <ShoppingBag className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <label htmlFor="email-order-updates" className="text-base font-medium">
                        Order Updates
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about your order status and shipping updates
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="email-order-updates"
                    checked={emailSettings.orderUpdates}
                    onCheckedChange={() => handleEmailToggle("orderUpdates")}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-start gap-3">
                    <Tag className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <label htmlFor="email-promotions" className="text-base font-medium">
                        Promotions & Discounts
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about sales, discounts, and special offers
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="email-promotions"
                    checked={emailSettings.promotions}
                    onCheckedChange={() => handleEmailToggle("promotions")}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-start gap-3">
                    <Bell className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <label htmlFor="email-new-items" className="text-base font-medium">
                        New Items
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new items are added to the marketplace
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="email-new-items"
                    checked={emailSettings.newItems}
                    onCheckedChange={() => handleEmailToggle("newItems")}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-start gap-3">
                    <Tag className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <label htmlFor="email-price-drops" className="text-base font-medium">
                        Price Drops
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when items in your wishlist drop in price
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="email-price-drops"
                    checked={emailSettings.priceDrops}
                    onCheckedChange={() => handleEmailToggle("priceDrops")}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-start gap-3">
                    <Megaphone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <label htmlFor="email-newsletter" className="text-base font-medium">
                        Newsletter
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Receive our monthly newsletter with gaming news and updates
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="email-newsletter"
                    checked={emailSettings.newsletter}
                    onCheckedChange={() => handleEmailToggle("newsletter")}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-start gap-3">
                    <Bell className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <label htmlFor="email-account-alerts" className="text-base font-medium">
                        Account Alerts
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Important notifications about your account security and changes
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="email-account-alerts"
                    checked={emailSettings.accountAlerts}
                    onCheckedChange={() => handleEmailToggle("accountAlerts")}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <label htmlFor="email-support-messages" className="text-base font-medium">
                        Support Messages
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails when support responds to your tickets
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="email-support-messages"
                    checked={emailSettings.supportMessages}
                    onCheckedChange={() => handleEmailToggle("supportMessages")}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading} className="ml-auto gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="push" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Push Notification Preferences
              </CardTitle>
              <CardDescription>Choose which push notifications you'd like to receive on your devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-start gap-3">
                    <ShoppingBag className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <label htmlFor="push-order-updates" className="text-base font-medium">
                        Order Updates
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about your order status and shipping updates
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="push-order-updates"
                    checked={pushSettings.orderUpdates}
                    onCheckedChange={() => handlePushToggle("orderUpdates")}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-start gap-3">
                    <Tag className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <label htmlFor="push-promotions" className="text-base font-medium">
                        Promotions & Discounts
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about sales, discounts, and special offers
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="push-promotions"
                    checked={pushSettings.promotions}
                    onCheckedChange={() => handlePushToggle("promotions")}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-start gap-3">
                    <Bell className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <label htmlFor="push-new-items" className="text-base font-medium">
                        New Items
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new items are added to the marketplace
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="push-new-items"
                    checked={pushSettings.newItems}
                    onCheckedChange={() => handlePushToggle("newItems")}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-start gap-3">
                    <Tag className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <label htmlFor="push-price-drops" className="text-base font-medium">
                        Price Drops
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when items in your wishlist drop in price
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="push-price-drops"
                    checked={pushSettings.priceDrops}
                    onCheckedChange={() => handlePushToggle("priceDrops")}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-start gap-3">
                    <Bell className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <label htmlFor="push-account-alerts" className="text-base font-medium">
                        Account Alerts
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Important notifications about your account security and changes
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="push-account-alerts"
                    checked={pushSettings.accountAlerts}
                    onCheckedChange={() => handlePushToggle("accountAlerts")}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <label htmlFor="push-support-messages" className="text-base font-medium">
                        Support Messages
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when support responds to your tickets
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="push-support-messages"
                    checked={pushSettings.supportMessages}
                    onCheckedChange={() => handlePushToggle("supportMessages")}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading} className="ml-auto gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


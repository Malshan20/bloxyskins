"use client"

import type React from "react"

import { useState } from "react"
import { useUser } from "@/components/user-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, Upload, Trash2 } from "lucide-react"
import Image from "next/image"

export default function SettingsPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // Form states
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    displayName: user?.displayName || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "/placeholder.svg?height=200&width=200",
    language: "english",
    theme: "dark",
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    newItemAlerts: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    toast({
      title: "Settings updated",
      description: "Your account settings have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-gaming text-2xl text-primary">Account Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="md:w-1/3">
                <div className="flex flex-col items-center gap-4 rounded-lg border border-border p-6 text-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-primary">
                    <Image src={formData.avatar || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                  </div>
                  <div className="space-y-2">
                    <Button type="button" variant="outline" size="sm" className="w-full gap-2">
                      <Upload className="h-4 w-4" />
                      Change Avatar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" value={formData.username} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="gap-2">
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
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={formData.language} onValueChange={(value) => handleSelectChange("language", value)}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={formData.theme} onValueChange={(value) => handleSelectChange("theme", value)}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 rounded-lg border border-border p-4">
                <h3 className="font-medium">Privacy Settings</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-profile">Public Profile</Label>
                    <p className="text-xs text-muted-foreground">Allow others to see your profile</p>
                  </div>
                  <Switch
                    id="public-profile"
                    checked={formData.marketingEmails}
                    onCheckedChange={(checked) => handleSwitchChange("marketingEmails", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-activity">Show Activity</Label>
                    <p className="text-xs text-muted-foreground">Show your recent purchases and activity</p>
                  </div>
                  <Switch
                    id="show-activity"
                    checked={formData.orderUpdates}
                    onCheckedChange={(checked) => handleSwitchChange("orderUpdates", checked)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="gap-2">
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
            </div>
          </form>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 rounded-lg border border-border p-4">
              <h3 className="font-medium">Email Notifications</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-xs text-muted-foreground">Receive emails about promotions and new items</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={formData.marketingEmails}
                  onCheckedChange={(checked) => handleSwitchChange("marketingEmails", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="order-updates">Order Updates</Label>
                  <p className="text-xs text-muted-foreground">Receive updates about your orders</p>
                </div>
                <Switch
                  id="order-updates"
                  checked={formData.orderUpdates}
                  onCheckedChange={(checked) => handleSwitchChange("orderUpdates", checked)}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-border p-4">
              <h3 className="font-medium">Push Notifications</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive notifications on your device</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={formData.pushNotifications}
                  onCheckedChange={(checked) => handleSwitchChange("pushNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-item-alerts">New Item Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get notified when new items are available</p>
                </div>
                <Switch
                  id="new-item-alerts"
                  checked={formData.newItemAlerts}
                  onCheckedChange={(checked) => handleSwitchChange("newItemAlerts", checked)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="gap-2">
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
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}


"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

const siteSettingsSchema = z.object({
  siteName: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }),
  siteDescription: z.string().min(10, {
    message: "Site description must be at least 10 characters.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  maintenanceMode: z.boolean().default(false),
  allowRegistration: z.boolean().default(true),
  allowGuestCheckout: z.boolean().default(true),
})

const apiSettingsSchema = z.object({
  stripePublicKey: z.string().min(1, {
    message: "Stripe public key is required.",
  }),
  stripeSecretKey: z.string().min(1, {
    message: "Stripe secret key is required.",
  }),
  paypalClientId: z.string().min(1, {
    message: "PayPal client ID is required.",
  }),
  paypalSecret: z.string().min(1, {
    message: "PayPal secret is required.",
  }),
})

export default function AdminSettings() {
  const [isSavingSite, setIsSavingSite] = useState(false)
  const [isSavingApi, setIsSavingApi] = useState(false)
  const { toast } = useToast()

  const siteForm = useForm<z.infer<typeof siteSettingsSchema>>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: "BloxySkins",
      siteDescription: "The ultimate marketplace for gaming and Roblox items",
      contactEmail: "support@bloxyskins.com",
      maintenanceMode: false,
      allowRegistration: true,
      allowGuestCheckout: true,
    },
  })

  const apiForm = useForm<z.infer<typeof apiSettingsSchema>>({
    resolver: zodResolver(apiSettingsSchema),
    defaultValues: {
      stripePublicKey: "pk_test_...",
      stripeSecretKey: "sk_test_...",
      paypalClientId: "client_id_...",
      paypalSecret: "client_secret_...",
    },
  })

  function onSaveSiteSettings(data: z.infer<typeof siteSettingsSchema>) {
    setIsSavingSite(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      setIsSavingSite(false)

      toast({
        title: "Settings Saved",
        description: "Site settings have been updated successfully.",
      })
    }, 1500)
  }

  function onSaveApiSettings(data: z.infer<typeof apiSettingsSchema>) {
    setIsSavingApi(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      setIsSavingApi(false)

      toast({
        title: "API Settings Saved",
        description: "API settings have been updated successfully.",
      })
    }, 1500)
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-primary">Settings</h1>

      <Tabs defaultValue="site">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="site">Site Settings</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="site" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>Manage your site settings and configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...siteForm}>
                <form onSubmit={siteForm.handleSubmit(onSaveSiteSettings)} className="space-y-6">
                  <FormField
                    control={siteForm.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of your site displayed in the browser tab and throughout the site
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={siteForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="min-h-20" />
                        </FormControl>
                        <FormDescription>Used for SEO and meta descriptions</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={siteForm.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormDescription>Primary contact email for the site</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={siteForm.control}
                      name="maintenanceMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Maintenance Mode</FormLabel>
                            <FormDescription>Put the site in maintenance mode</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={siteForm.control}
                      name="allowRegistration"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Allow Registration</FormLabel>
                            <FormDescription>Allow new users to register</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={siteForm.control}
                      name="allowGuestCheckout"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Guest Checkout</FormLabel>
                            <FormDescription>Allow checkout without an account</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isSavingSite}>
                    {isSavingSite ? "Saving..." : "Save Settings"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Configure your payment gateway API keys</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...apiForm}>
                <form onSubmit={apiForm.handleSubmit(onSaveApiSettings)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Stripe</h3>
                    <FormField
                      control={apiForm.control}
                      name="stripePublicKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Public Key</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={apiForm.control}
                      name="stripeSecretKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret Key</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">PayPal</h3>
                    <FormField
                      control={apiForm.control}
                      name="paypalClientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client ID</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={apiForm.control}
                      name="paypalSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Secret</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isSavingApi}>
                    {isSavingApi ? "Saving..." : "Save API Settings"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


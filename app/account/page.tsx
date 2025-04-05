"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "@/components/user-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Clock, Settings, ArrowRight, Star, Shield, Bell } from "lucide-react"
import { motion } from "framer-motion"

// Mock recent orders data
const recentOrders = [
  {
    id: "ORD-7652",
    date: "2023-04-01",
    status: "delivered",
    total: 124.99,
    items: [{ name: "Green Queen", image: "/items/green-queen.png", quantity: 1 }],
  },
  {
    id: "ORD-7523",
    date: "2023-03-25",
    status: "processing",
    total: 89.99,
    items: [{ name: "Blizzard Beast", image: "/items/blizzard-beast.png", quantity: 1 }],
  },
]

// Mock wishlist data
const wishlistItems = [
  {
    id: "ITEM-001",
    name: "Supa Dupa",
    image: "/items/supa-dupa.png",
    price: 149.99,
    game: "Roblox",
  },
  {
    id: "ITEM-002",
    name: "Scissors",
    image: "/items/scissors.png",
    price: 79.99,
    game: "Roblox",
  },
]

export default function AccountPage() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "processing":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-gaming text-2xl text-primary">Account Overview</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.username || "User"}</p>
        </div>
        <Link href="/account/settings">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Account Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-4 text-center shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">3</h3>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>

              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-4 text-center shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">2</h3>
                <p className="text-sm text-muted-foreground">Wishlist Items</p>
              </div>

              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-4 text-center shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">1</h3>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-4 space-y-4">
          {recentOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">Order #{order.id}</CardTitle>
                      <CardDescription>{new Date(order.date).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge className={cn("px-2 py-1", getStatusColor(order.status))}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-md border border-border">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t pt-4">
                  <p className="font-medium">Total: ${order.total.toFixed(2)}</p>
                  <Link href={`/account/orders/${order.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1">
                      View Details
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}

          <div className="flex justify-center pt-2">
            <Link href="/account/orders">
              <Button variant="outline" className="gap-2">
                View All Orders
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="wishlist" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md border border-border">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-xs text-muted-foreground">{item.game}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-primary">${item.price.toFixed(2)}</p>
                          <Link href={`/item/${item.id}`}>
                            <Button size="sm">View Item</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>Your account has basic security. Consider enabling 2FA for additional protection.</p>
          </CardContent>
          <CardFooter>
            <Link href="/account/security" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Security Settings
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>You have email notifications enabled for orders and promotions.</p>
          </CardContent>
          <CardFooter>
            <Link href="/account/notifications" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Notification Settings
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>Customize your shopping experience and account settings.</p>
          </CardContent>
          <CardFooter>
            <Link href="/account/settings" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Account Settings
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


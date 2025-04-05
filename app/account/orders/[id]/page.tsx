"use client"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ArrowLeft, Download, MessageSquare, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

// Mock order data
const orderDetails = {
  id: "ORD-7652",
  date: "2023-04-01",
  status: "delivered",
  total: 124.99,
  subtotal: 119.99,
  tax: 5.0,
  shipping: 0,
  paymentMethod: "Credit Card (ending in 4242)",
  items: [
    {
      id: "ITEM-001",
      name: "Green Queen",
      image: "/items/green-queen.png",
      quantity: 1,
      price: 119.99,
      game: "Roblox",
    },
  ],
  shippingAddress: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
  },
  timeline: [
    { status: "Order Placed", date: "2023-04-01T10:30:00Z" },
    { status: "Payment Confirmed", date: "2023-04-01T10:35:00Z" },
    { status: "Processing", date: "2023-04-01T11:00:00Z" },
    { status: "Delivered", date: "2023-04-01T14:20:00Z" },
  ],
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  // In a real app, you would fetch the order details based on the ID
  const order = orderDetails

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "processing":
      case "payment confirmed":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-gaming text-2xl text-primary">Order #{order.id}</h1>
            <p className="text-sm text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Invoice
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Support
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <CardTitle>Order Status</CardTitle>
                <Badge className={cn("px-2 py-1", getStatusColor(order.status))}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mt-2 space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={cn(
                          "z-10 flex h-6 w-6 items-center justify-center rounded-full border-2",
                          index === order.timeline.length - 1
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground bg-background",
                        )}
                      >
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            index === order.timeline.length - 1 ? "bg-primary-foreground" : "bg-muted-foreground",
                          )}
                        />
                      </div>
                      {index < order.timeline.length - 1 && <div className="absolute top-6 h-full w-px bg-border" />}
                    </div>
                    <div className="pb-6">
                      <p className="font-medium">{event.status}</p>
                      <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-4 rounded-lg border border-border p-4"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border border-border">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-xs text-muted-foreground">{item.game}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <p className="font-medium">${item.price.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link href={`/item/${item.id}`}>
                          <Button variant="ghost" size="sm">
                            View Item
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Contact Information</h3>
                <p className="text-sm">{order.shippingAddress.name}</p>
                <p className="text-sm">{order.shippingAddress.email}</p>
                <p className="text-sm">{order.shippingAddress.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Payment Method</h3>
                <p className="text-sm">{order.paymentMethod}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>If you have any issues with your order, our support team is here to help.</p>
              <div className="mt-4">
                <Link href="/support">
                  <Button className="w-full">Contact Support</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


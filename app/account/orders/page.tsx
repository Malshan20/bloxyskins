"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ArrowRight, Search, Download } from "lucide-react"
import { motion } from "framer-motion"

// Mock orders data
const orders = [
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
  {
    id: "ORD-7498",
    date: "2023-03-10",
    status: "delivered",
    total: 199.99,
    items: [
      { name: "Supa Dupa", image: "/items/supa-dupa.png", quantity: 1 },
      { name: "Scissors", image: "/items/scissors.png", quantity: 1 },
    ],
  },
]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-gaming text-2xl text-primary">Order History</h1>
          <p className="text-sm text-muted-foreground">View and track your orders</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export Orders
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
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
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
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
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No orders found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter to find what you're looking for."
                : "You haven't placed any orders yet."}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Link href="/">
                <Button className="mt-4">Browse Products</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


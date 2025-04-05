"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, MessageSquare, Users, DollarSign, TrendingUp, ShoppingCart } from "lucide-react"
import { marketItems } from "@/data/market-items"
import { formatPrice } from "@/lib/utils"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingApplications: 0,
    unreadMessages: 0,
    totalRevenue: 0,
    recentOrders: 0,
    activeUsers: 0,
  })

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use mock data
    setStats({
      totalProducts: marketItems.length,
      pendingApplications: 12,
      unreadMessages: 8,
      totalRevenue: marketItems.reduce((acc, item) => acc + item.price, 0) * 0.3, // Simulate some sales
      recentOrders: 24,
      activeUsers: 156,
    })
  }, [])

  return (
    <div>
      <h1 className="dashboard-title mb-8 font-gaming text-3xl text-primary">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="dashboard-card gaming-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">{stats.totalProducts > 30 ? "+2" : "0"} added today</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card gaming-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingApplications > 10 ? "+3" : "0"} new today</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card gaming-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">{stats.unreadMessages > 5 ? "+2" : "0"} new today</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card gaming-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">+{formatPrice(stats.totalRevenue * 0.05)} from last month</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card gaming-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentOrders}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(stats.recentOrders * 0.2)} from yesterday</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card gaming-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(stats.activeUsers * 0.1)} from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="dashboard-card gaming-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New order #NG-1234</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New seller application</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New support message</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New product added</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card gaming-card">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border/50 bg-card p-3">
                  <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  <p className="text-lg font-bold">3.2%</p>
                </div>
                <div className="rounded-lg border border-border/50 bg-card p-3">
                  <p className="text-xs text-muted-foreground">Avg. Order Value</p>
                  <p className="text-lg font-bold">{formatPrice(1250)}</p>
                </div>
                <div className="rounded-lg border border-border/50 bg-card p-3">
                  <p className="text-xs text-muted-foreground">Items Sold (Month)</p>
                  <p className="text-lg font-bold">128</p>
                </div>
                <div className="rounded-lg border border-border/50 bg-card p-3">
                  <p className="text-xs text-muted-foreground">New Users (Week)</p>
                  <p className="text-lg font-bold">45</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

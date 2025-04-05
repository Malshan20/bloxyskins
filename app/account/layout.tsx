"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUser } from "@/components/user-provider"
import { redirect } from "next/navigation"
import { User, Settings, ShoppingBag, Bell, Shield, CreditCard, Loader2 } from 'lucide-react'

const accountNavItems = [
  { name: "Overview", href: "/account", icon: User },
  { name: "Orders", href: "/account/orders", icon: ShoppingBag },
  { name: "Settings", href: "/account/settings", icon: Settings },
  { name: "Payment Methods", href: "/account/payment", icon: CreditCard },
  { name: "Security", href: "/account/security", icon: Shield },
  { name: "Notifications", href: "/account/notifications", icon: Bell },
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading } = useUser()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle authentication check after mounting to avoid hydration issues
  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      redirect("/login?redirect=" + encodeURIComponent(pathname))
    }
  }, [isMounted, isLoading, isAuthenticated, pathname])

  if (!isMounted || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Sidebar Navigation */}
        <aside className="md:col-span-1">
          <div className="sticky top-24 rounded-lg border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-4 font-gaming text-xl text-primary">My Account</h2>
            <nav className="space-y-1">
              {accountNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

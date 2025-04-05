"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, MessageSquare, Users, Settings, LogOut, Menu, X, ChevronDown } from "lucide-react"
import { useUser } from "@/components/user-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

const adminNavItems = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: "Products", href: "/admin/products", icon: <Package className="h-5 w-5" /> },
  { name: "Support", href: "/admin/support", icon: <MessageSquare className="h-5 w-5" /> },
  { name: "Applications", href: "/admin/applications", icon: <Users className="h-5 w-5" /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
]

export function AdminNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useUser()

  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <Image src="/logo.svg" alt="BloxySkins Logo" fill className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-gaming text-xl text-primary">BloxySkins</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="relative h-8 w-8 overflow-hidden rounded-full border border-primary/50">
                  <Image
                    src={user?.avatar || "/placeholder.svg?height=32&width=32"}
                    alt={user?.username || "Admin"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user?.username || "Admin"}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/">
                <DropdownMenuItem>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>View Site</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/admin/settings">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md"
          >
            <div className="px-4 py-2 space-y-1">
              {adminNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md",
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-border/50 mt-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-destructive/50 text-destructive hover:bg-destructive/10"
                  size="sm"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}


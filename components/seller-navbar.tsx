"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Menu, X, Bell } from 'lucide-react'
import { useUser } from "@/components/user-provider"
import { cn } from "@/lib/utils"

export function SellerNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useUser()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-background transition-all duration-200",
        scrolled ? "shadow-md" : ""
      )}>
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="block lg:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/seller" className="flex items-center gap-2">
              <span className="font-cyberway text-xl text-primary">BloxySkins</span>
              <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Seller</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                3
              </span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <div className="text-sm font-medium">{user?.name || "Seller"}</div>
                <div className="text-xs text-muted-foreground">{user?.email || "seller@example.com"}</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {user?.name ? user.name[0].toUpperCase() : "S"}
              </div>
            </div>
            
            <button 
              onClick={() => {
                logout();
                window.location.href = '/seller/seller-login';
              }} 
              className="hidden items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 md:flex"
              aria-label="Log out"
            >
              <LogOut className="h-3 w-3" />
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile navigation */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-all duration-200 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
      />
      
      <div
        className={cn(
          "fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-background p-4 shadow-lg transition-all duration-200 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => {
              logout();
              setIsOpen(false);
              window.location.href = '/seller-login';
            }} 
            className="mt-4 flex w-full items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </nav>
      </div>
    </>
  )
}

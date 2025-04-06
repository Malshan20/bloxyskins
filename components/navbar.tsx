"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DiscIcon as Discord, Menu, X, ShoppingCart, User, LogOut, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useCart } from "@/components/cart-provider"
import { useUser } from "@/components/user-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DiscordLogoIcon } from "@radix-ui/react-icons"

const navLinks = [
  { name: "Market", href: "/" },
  { name: "Support", href: "/support" },
  { name: "Become a Seller", href: "/seller-application" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { itemCount, setIsCartOpen } = useCart()
  const { user, isAuthenticated, logout } = useUser()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useGSAP(() => {
    gsap.from(".nav-item", {
      opacity: 0,
      y: -20,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
    })

    gsap.from(".logo", {
      opacity: 0,
      x: -30,
      duration: 1,
      ease: "power3.out",
    })

    gsap.from(".nav-buttons", {
      opacity: 0,
      x: 30,
      duration: 1,
      ease: "power3.out",
    })
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-lg" : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="logo flex items-center gap-2">
          <div className="relative h-8 w-8">
            <Image src="/logo.svg" alt="NexusGear Logo" fill className="object-contain" />
          </div>
          <span className="font-gaming text-xl text-primary">BloxySkins</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "nav-item relative px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary",
              )}
            >
              {link.name}
              {pathname === link.href && (
                <motion.div className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" layoutId="navbar-indicator" />
              )}
            </Link>
          ))}
        </nav>

        <div className="nav-buttons flex items-center gap-2">
          {/* Cart Button */}
          <Button variant="ghost" size="icon" className="relative text-primary" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
              >
                {itemCount}
              </motion.span>
            )}
          </Button>

          {/* Discord Button */}
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
          >
           <DiscordLogoIcon className="h-4 w-4" />
            <span>Discord</span>
          </Button>

          {/* User Menu or Login Button */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-primary/50">
                    <Image
                      src={user?.avatar || "/placeholder.svg?height=32&width=32"}
                      alt={user?.username || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.username}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/account">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Account</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/account/settings">
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
          ) : (
            <Link href="/login">
              <Button size="sm" className="hidden md:flex items-center gap-2 bg-primary text-white hover:bg-primary/90">
                Log In
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
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
            className="md:hidden bg-card/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "block py-2 text-sm font-medium transition-colors",
                    pathname === link.href ? "text-primary" : "text-muted-foreground",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 items-center gap-2 border-primary/50 text-primary"
                >
                  <Discord className="h-4 w-4" />
                  <span>Discord</span>
                </Button>
                {!isAuthenticated && (
                  <Link href="/login" className="flex-1">
                    <Button size="sm" className="w-full items-center gap-2 bg-primary text-white">
                      Log In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}


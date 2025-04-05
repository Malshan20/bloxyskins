import type React from "react"
import type { Metadata } from "next"
import { Mona_Sans as FontSans } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { MarketplaceProvider } from "@/components/marketplace-provider"
import { UserProvider } from "@/components/user-provider"
import { CartProvider } from "@/components/cart-provider"
import { CartDrawer } from "@/components/cart-drawer"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Custom gaming font
const fontGaming = localFont({
  src: "../public/fonts/Cyberway.woff2",
  variable: "--font-gaming",
  display: "swap",
})

export const metadata: Metadata = {
  title: "BloxySkins | Gaming & Roblox Marketplace",
  description: "The ultimate marketplace for gaming and Roblox items",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable, fontGaming.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <UserProvider>
            <CartProvider>
              <MarketplaceProvider>
                <div className="relative flex min-h-screen flex-col">
                  <Navbar />
                  <div className="flex-1">{children}</div>
                </div>
                <CartDrawer />
                <Toaster />
              </MarketplaceProvider>
            </CartProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
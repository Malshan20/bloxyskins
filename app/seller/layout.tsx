"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/user-provider"
import { SellerNavbar } from "@/components/seller-navbar"

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useUser()
  const router = useRouter()

//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push("/login?redirect=/seller")
//       return
//     }

//     if (user?.role !== "seller") {
//       router.push("/")
//     }
//   }, [isAuthenticated, user, router])

//   if (!isAuthenticated || user?.role !== "seller") {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//       </div>
//     )
//   }

  return (
    <div className="min-h-screen bg-background">
      <SellerNavbar />
      <main className="pt-16 min-h-screen">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  )
}


import SellerDashboard from "@/components/seller-dashboard"
import type { Metadata } from "next"


export const metadata: Metadata = {
  title: "Seller Dashboard",
  description: "Manage and sell your digital products",
}

export default function SellerPage() {
  return <SellerDashboard />
}


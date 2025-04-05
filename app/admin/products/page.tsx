"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Edit, Trash, Eye } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { marketItems } from "@/data/market-items"
import type { MarketItem } from "@/components/marketplace-provider"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function AdminProducts() {
  const [products, setProducts] = useState<MarketItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<MarketItem[]>([])
  const router = useRouter()
  const { toast } = useToast()

  useGSAP(() => {
    gsap.from(".products-title", {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    })

    gsap.from(".products-actions", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    })

    gsap.from(".products-table", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: "power3.out",
    })
  }, [])

  useEffect(() => {
    // In a real app, this would be an API call
    setProducts(marketItems)
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            (product.rarity && product.rarity.toLowerCase().includes(query)),
        ),
      )
    }
  }, [searchQuery, products])

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      // In a real app, this would be an API call
      setProducts((prev) => prev.filter((product) => product.id !== id))

      toast({
        title: "Product Deleted",
        description: "The product has been deleted successfully.",
      })
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="products-title font-gaming text-3xl text-primary">Products</h1>
        <Link href="/admin/products/add">
          <Button className="products-actions gaming-button">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="products-actions mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="products-table rounded-md border border-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rarity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">RAP</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative h-10 w-10 overflow-hidden rounded-md">
                    <Image
                      src={product.image || `/placeholder.svg?height=40&width=40`}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  {product.rarity ? (
                    <Badge
                      variant="outline"
                      className={`${
                        product.rarity === "Common"
                          ? "bg-slate-500/20 text-slate-500"
                          : product.rarity === "Uncommon"
                            ? "bg-green-500/20 text-green-500"
                            : product.rarity === "Rare"
                              ? "bg-blue-500/20 text-blue-500"
                              : product.rarity === "Epic"
                                ? "bg-purple-500/20 text-purple-500"
                                : "bg-orange-500/20 text-orange-500"
                      }`}
                    >
                      {product.rarity}
                    </Badge>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                <TableCell className="text-right">{formatPrice(product.rap)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push(`/item/${product.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/admin/products/edit/${product.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

